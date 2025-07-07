import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import useLogout from "../../../Hooks/useLogout";
import { finalTicketBooking } from "../../../api/bookingAPI";
import { clearRedisLock } from "../../../utils/clearResources";
import { refreshToken } from "../../../api/authAPI";

const FinalPaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  //    coming from ticket booking
  // movieId,
  // movieTitle,
  // selectedSeats,
  // userId,
  // fromBooking:true,
  // sessionId,
  // date,
  // theatre,
  // theatreId,
  // showTime,
  // city

  const {
    movieId,
    movieTitle,
    selectedSeats,
    userId,
    fromBooking,
    sessionId,
    date,
    theatre,
    theatreId,
    showTime,
    city,
  } = location.state || {};

  const handleBack = async () => {
    const payload = {
      movieId,
      userId,
      sessionId,
    };
    await clearRedisLock(payload, logout);
    navigate("/home");
  };

  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      try {
        await fetch(
          `${process.env.REACT_APP_MOVIEVERSE_SVC_API_BASE_URL}/v1/clear-lock`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ movieId, userId, sessionId }),
            credentials: "include",
            keepalive: true,
          }
        );
        navigate("/home");
      } catch (err) {
        console.error("Unload clear-lock failed:", err);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [movieId, userId]);

  if (!fromBooking) {
    return <Navigate to="/home" replace />;
  }
  const handlePayment = async () => {
    setLoading(true);
    try {
      const finalBookingpayload = {
        movieId,
        movieTitle,
        seats: selectedSeats,
        userId,
        sessionId,
        date,
        theatre,
        theatreId,
        showTime,
        city,
      };
      const res = await finalTicketBooking(finalBookingpayload);

      if (res.status === 200) {
        toast.success("Payment successful and booking confirmed!");
        alert("Payment successful and booking confirmed!");
        setLoading(false);
        navigate("/home");
      }
    } catch (err) {
      console.error("Error in Booking Ticket", err);
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (status === 401) {
        try {
          const refreshRes = await refreshToken();
          if (refreshRes.status === 200) {
            const finalBookingpayload = {
              movieId,
              movieTitle,
              seats: selectedSeats,
              userId,
              sessionId,
              date,
              theatre,
              theatreId,
              showTime,
              city,
            };
            const retryRes = await finalTicketBooking(finalBookingpayload);
            if (retryRes.status === 200) {
              toast.success("Payment successful and booking confirmed!");
              alert("Payment successful and booking confirmed!");
              setLoading(false);
              navigate("/home");
              return;
            }
          } else {
            alert(message);
            logout();
          }
        } catch (refreshErr) {
          alert(refreshErr.response?.data?.message);
          logout();
        }
      } else if (status === 403) {
        alert(message);
        logout();
      } else if (status === 400 || status === 500) {
        toast.error(message);
      } else if (status === 409 || status === 419) {
        toast.error(message);
        alert(` ${message}`);
        navigate("/home");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <button
        onClick={handleBack}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          marginBottom: "20px",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Back
      </button>
      <p>
        You have got a Minute to make your payment ,otherwise seats will be
        cancelled
      </p>
      <h2>Final Payment</h2>
      <p>
        <strong>Movie:</strong> {movieTitle}
      </p>
      <p>
        <strong>Seats:</strong> {selectedSeats.join(", ")}
      </p>
      <p>
        <strong>Date:</strong> {date}
      </p>
      <p>
        <strong>Theatre:</strong> {theatre}
      </p>
      <p>
        <strong>City:</strong> {city}
      </p>
      <p>
        <strong>Show Time:</strong>
        {showTime}
      </p>
      <button
        onClick={handlePayment}
        style={{
          padding: "14px 30px",
          fontSize: "16px",
          background: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
        }}
        disabled={loading}
      >
        {loading ? "Payment Processing.." : "Make Payment"}
      </button>
    </div>
  );
};

export default FinalPaymentPage;

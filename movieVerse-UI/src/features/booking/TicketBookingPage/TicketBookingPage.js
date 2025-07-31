import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
// import axios from "axios";
import "./TicketBookingPage.css";
import { getUserId,getUserIdByToken } from "../../../utils/getUserId";
import { toast } from "react-toastify";
import useLogout from "../../../Hooks/useLogout";
import { getReservedSeats, lockSeats } from "../../../api/bookingAPI";
import { clearRedisLock } from "../../../utils/clearResources";
import { refreshToken } from "../../../api/authAPI";

const TicketBookingPage = () => {
  const [loading, setloading] = useState(false);
  const { movieId, mediaType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const { movieTitle, date, theatre, theatreId, showTime, city } =
    location.state;
  // coming from theatre booking page
  //   movieTitle,
  // movieId,
  // media_type,
  // date: today,
  // theatre: theatre.name,
  // theatreId: theatre.id,
  // showTime,
  // city:location
  const rows = 5;
  const cols = 10;
  const totalSeats = rows * cols;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const sessionId = sessionStorage.getItem("bookingSessionId");

  useEffect(() => {
    const clearBookingLock = async () => {
      const sessionId = sessionStorage.getItem("bookingSessionId");
      const userId = getUserId();
      console.log("userId Booking",userId);
      const userIdByToken= await getUserIdByToken();
      console.log("userIdByToken Booking",userIdByToken);

      if (sessionId && movieId && userIdByToken) {
        const payload = { movieId, userId: userIdByToken, sessionId };
        await clearRedisLock(payload, logout);
      }
    };

    clearBookingLock();
  }, []);

  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        const payload = {
          movieId,
          date,
          theatreId,
          showTime,
        };
        const res = await getReservedSeats(payload);
        if (res.status === 200) {
          setReservedSeats(res.data.reservedSeats || []);
        } else {
          toast.error("Unexpected Response from server");
          navigate("/home");
        }
      } catch (err) {
        console.error("Failed to fetch reserved seats:", err);
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 401) {
          try {
            const refreshRes = await refreshToken();

            if (refreshRes.status === 200) {
              const payload = {
                movieId,
                date,
                theatreId,
                showTime,
              };
              const retryRes = await getReservedSeats(payload);
              if (retryRes.status === 200) {
                setReservedSeats(retryRes.data.reservedSeats || []);
                return;
              } else {
                toast.error("Retry failed after refreshing token.");
                logout();
              }
            } else {
              alert(message);
              logout();
            }
          } catch (refreshErr) {
            alert(refreshErr.response?.data?.message || "Session expired.");
            logout();
          }
        } else if (status === 403) {
          alert(message);
          logout();
        } else if (status === 400 || status === 500) {
          toast.error(message);
          navigate("/home");
        } else {
          toast.error(message);
        }
      }
    };
    fetchReservedSeats();
  }, [movieId]);

  const toggleSeat = (seat) => {
    if (reservedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    const userId = getUserId();
      console.log("userId Booking",userId);
      const userIdByToken= await getUserIdByToken();
      console.log("userIdByToken Booking",userIdByToken);
      
    setloading(true);

    const payload = {
      movieId,
      date,
      theatreId,
      showTime,
    };

    const lockSeatBookload = {
      movieId,
      movieTitle,
      seats: selectedSeats,
      mediaType,
      userId:userIdByToken,
      sessionId,
      date,
      theatre,
      theatreId,
      showTime,
    };

    try {
      let reservedRes;
      try {
        reservedRes = await getReservedSeats(payload);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          const refreshRes = await refreshToken();
          if (refreshRes.status === 200) {
            reservedRes = await getReservedSeats(payload);
          } else {
            alert("Session expired. Please login again.");
            logout();
            return;
          }
        } else {
          throw err;
        }
      }

      const latestReserved = reservedRes.data.reservedSeats || [];
      const conflict = selectedSeats.some((seat) =>
        latestReserved.includes(seat)
      );

      if (conflict) {
        setloading(false);
        alert(
          "❌ Some of the seats you selected have already been booked by someone else.\nPlease refresh and select different seats."
        );
        return;
      }

      let res;
      try {
        res = await lockSeats(lockSeatBookload);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          const refreshRes = await refreshToken();
          if (refreshRes.status === 200) {
            res = await lockSeats(lockSeatBookload);
          } else {
            alert("Session expired. Please login again.");
            logout();
            return;
          }
        } else {
          throw err;
        }
      }

      if (res.status === 200) {
        navigate("/final-payment", {
          state: {
            movieId,
            movieTitle,
            selectedSeats,
            userId:userIdByToken,
            fromBooking: true,
            sessionId,
            date,
            theatre,
            theatreId,
            showTime,
            city,
          },
        });
      }
    } catch (err) {
      console.error("Error during booking:", err);
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 403) {
        alert(message);
        logout();
      } else if (status === 400 || status === 500) {
        toast.error(message);
        navigate("/home");
      } else if (status === 409) {
        toast.error(message);
        alert("Booking failed. Seat might already be taken.");
      } else {
        alert("Unexpected error occurred.");
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="book-page">
      <h2>Select Seats for {movieTitle}</h2>
      <div className="screen">SCREEN</div>
      <div className="seats-grid">
        {Array.from({ length: totalSeats }, (_, i) => {
          const row = String.fromCharCode(65 + Math.floor(i / cols));
          const col = (i % cols) + 1;
          const seatNumber = `${row}${col}`;
          const isSelected = selectedSeats.includes(seatNumber);
          const isReserved = reservedSeats.includes(seatNumber);

          return (
            <div
              key={seatNumber}
              className={`seat ${isSelected ? "selected" : ""} ${
                isReserved ? "reserved" : ""
              }`}
              onClick={() => toggleSeat(seatNumber)}
            >
              {seatNumber}
            </div>
          );
        })}
      </div>

      <div className="actions">
        <button
          onClick={handleBooking}
          disabled={selectedSeats.length === 0 || loading}
        >
          {loading ? "Processing.." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default TicketBookingPage;

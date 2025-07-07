import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";
import { getUserProfileDetails } from "../../api/userAPI";
import useLogout from "../../Hooks/useLogout";
import { toast } from "react-toastify";
import { refreshToken } from "../../api/authAPI";
const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const logout = useLogout();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfileDetails(userId);
        if (response.status === 200) {
          setProfile(response.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 401) {
          try {
            const refreshRes = await refreshToken();
            if (refreshRes.status === 200) {
              const retryRes = await getUserProfileDetails(userId);
              if (retryRes.status === 200) {
                setProfile(retryRes.data);
              }
            } else {
              alert(message);
              logout();
            }
          } catch (refreshErr) {
            console.log("Error refreshing token:", refreshErr);
            alert(refreshErr.response?.data?.message);
            logout();
          }
        } else if (status === 403 || status === 404) {
          alert(message);
          logout();
        } else if (status === 400 || status === 500) {
          toast.error(message);
        }
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return <div className="profile-page">Loading...</div>;
  }

  const { user, bookings } = profile;

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      <div className="user-details">
        <p>
          <strong>Name:</strong> {user.fullname}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Joined:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <h3>Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <p>
                <strong>TicketId:</strong> {booking._id}
              </p>
              <p>
                <strong>Movie:</strong> {booking.movieTitle}
              </p>
              <p>
                <strong>City:</strong> {booking.city}
              </p>
              <p>
                <strong>Theatre:</strong> {booking.theatreName}
              </p>
              <p>
                <strong>Date:</strong> {booking.date}
              </p>
              <p>
                <strong>Show Time:</strong> {booking.showTime}
              </p>
              <p>
                <strong>Seats:</strong> {booking.seats.join(", ")}
              </p>
              <p>
                <strong>Booked On:</strong>{" "}
                {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

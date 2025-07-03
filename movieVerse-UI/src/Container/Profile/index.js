// import React from 'react'
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// const Profile = () => {
//     const {userId}=useParams();
//     console.log("userId",userId)
// const handleProfile =async () => {
    
        // const profileDetails = await axios.get(`http://localhost:4000/v1/profile-details`, {
        //     params: { userId
        //             },
        //       withCredentials: true
        // });
//         console.log("Profile Details",profileDetails)
        
// }
//   return (
//     <div>
//         <p>Userprofile</p>
//         <buton onClick={handleProfile}>Profile</buton>
//     </div>
//   )
// }

// export default Profile;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/v1/profile-details`, {
            params: { userId
                    },
              withCredentials: true
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
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
        <p><strong>Name:</strong> {user.fullname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <h3>Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <p><strong>Movie:</strong> {booking.movieTitle}</p>
              <p><strong>City:</strong> {booking.city}</p>
              <p><strong>Theatre:</strong> {booking.theatreName}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Show Time:</strong> {booking.showTime}</p>
              <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
              <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

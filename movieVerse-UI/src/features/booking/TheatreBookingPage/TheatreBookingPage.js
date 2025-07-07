import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TheatreBookingPage.css";

const TheatreDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movieTitle, movieId, media_type } = location.state;

  const today = new Date(Date.now() + 86400000).toDateString();

  const theatres = [
    {
      id: "t1",
      name: "PVR Noida",
      location: "Noida",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
    {
      id: "t2",
      name: "INOX Noida",
      location: "Noida",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
    {
      id: "t3",
      name: "Wave Agra",
      location: "Agra",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
    {
      id: "t4",
      name: "Carnival Agra",
      location: "Agra",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
    {
      id: "t5",
      name: "Miraj Noida",
      location: "Noida",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
    {
      id: "t6",
      name: "Cinepolis Agra",
      location: "Agra",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
    {
      id: "t7",
      name: "Fun Cinema Noida",
      location: "Noida",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
    {
      id: "t8",
      name: "Gold Cinema Agra",
      location: "Agra",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
    {
      id: "t9",
      name: "MX4D Agra",
      location: "Agra",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
    {
      id: "t10",
      name: "SRS Noida",
      location: "Noida",
      shows: ["9:00 AM", "3:10 PM", "8:00 PM"],
    },
  ];

  const [selectedLocation, setSelectedLocation] = useState("All");

  const handleShowClick = (theatre, showTime, location) => {
    navigate(`/book/${movieId}/${media_type}`, {
      state: {
        movieTitle,
        movieId,
        media_type,
        date: today,
        theatre: theatre.name,
        theatreId: theatre.id,
        showTime,
        city: location,
      },
    });
  };

  return (
    <div className="theatre-page">
      <h2>{movieTitle}</h2>
      <p className="date-line">Show Date: {today}</p>
      <p> Language: Hindi-2D</p>
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="location-select">Choose Location:</label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All India</option>
            <option value="Noida">Noida</option>
            <option value="Agra">Agra</option>
          </select>
        </div>
      </div>

      <div className="theatre-list">
        {theatres
          .filter(
            (t) => selectedLocation === "All" || t.location === selectedLocation
          )
          .map((theatre) => (
            <div className="theatre-card" key={theatre.id}>
              <h3>{theatre.name} </h3>
              <div className="showtimes">
                {theatre.shows.map((time) => (
                  <button
                    key={time}
                    className="showtime"
                    onClick={() =>
                      handleShowClick(theatre, time, theatre.location)
                    }
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TheatreDetailsPage;

// src/pages/BookTicketPage.jsx

import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './BookTicketPage.css';

const TicketBookingPage = () => {
    const { movieId, mediaType } = useParams();
    const location = useLocation();
    const title = location.state?.title || "Unknown Movie";

    const [selectedSeats, setSelectedSeats] = useState([]);
    const totalSeats = 30;

    const toggleSeat = (seatNumber) => {
        setSelectedSeats(prev =>
            prev.includes(seatNumber)
                ? prev.filter(s => s !== seatNumber)
                : [...prev, seatNumber]
        );
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:4000/v1/book-ticket', {
                movieId,
                title,
                seats: selectedSeats,
                showTime: new Date()
            });
            alert('Booking Successful!');
        } catch (err) {
            console.error(err);
            alert('Booking failed.');
        }
    };

    return (
        <div className="book-page">
            <h2>Book Seats for {title}</h2>
            <div className="seats-grid">
                {Array.from({ length: totalSeats }, (_, i) => {
                    const seatNumber = `S${i + 1}`;
                    const isSelected = selectedSeats.includes(seatNumber);
                    return (
                        <div
                            key={seatNumber}
                            className={`seat ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleSeat(seatNumber)}
                        >
                            {seatNumber}
                        </div>
                    );
                })}
            </div>
            <div className="actions">
                <button onClick={handleSubmit} disabled={selectedSeats.length === 0}>
                    Confirm Booking
                </button>
            </div>
        </div>
    );
};

export default TicketBookingPage;

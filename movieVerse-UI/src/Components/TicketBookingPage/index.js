import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './TicketBookingPage.css';
import getUserId from '../../utils/getUserId';

const TicketBookingPage = () => {
    const { movieId, mediaType } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const title = location.state?.title || 'Unknown Movie';
    const showTime = new Date().toISOString(); // optional: pass timestamp for identifying a show
    const rows = 5;
    const cols = 10;
    const totalSeats = rows * cols;

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]);

    // ✅ Fetch reserved seats on load
    useEffect(() => {
        const fetchReservedSeats = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/v1/booked-seats`, {
                    params: {
                        movieId,
                        showTime
                    }
                });
                setReservedSeats(res.data.reservedSeats || []);
            } catch (err) {
                console.error('Failed to fetch reserved seats:', err);
            }
        };
        fetchReservedSeats();
    }, [movieId, showTime]);

    const toggleSeat = (seat) => {
        if (reservedSeats.includes(seat)) return; // can't toggle reserved seat

        setSelectedSeats((prev) =>
            prev.includes(seat)
                ? prev.filter((s) => s !== seat)
                : [...prev, seat]
        );
    };

    const handleBooking = async () => {
        const userId=getUserId();
        try {
            const res = await axios.post('http://localhost:4000/v1/book-ticket', {
                movieId,
                title,
                seats: selectedSeats,
                showTime,
                mediaType,
                userId
            });

            if (res.status === 200) {
                navigate('/final-payment', {
                    state: {
                        movieId,
                        title,
                        selectedSeats,
                        showTime,
                        userId
                    },
                });
            }
        } catch (err) {
            alert('Booking failed. Seat might already be taken.');
            console.error(err);
        }
    };

    return (
        <div className="book-page">
            <h2>Select Seats for {title}</h2>
            <div className="screen">SCREEN</div>
            <div className="seats-grid">
                {Array.from({ length: totalSeats }, (_, i) => {
                    const row = String.fromCharCode(65 + Math.floor(i / cols)); // A, B, C...
                    const col = (i % cols) + 1;
                    const seatNumber = `${row}${col}`;
                    const isSelected = selectedSeats.includes(seatNumber);
                    const isReserved = reservedSeats.includes(seatNumber);

                    return (
                        <div
                            key={seatNumber}
                            className={`seat ${isSelected ? 'selected' : ''} ${isReserved ? 'reserved' : ''}`}
                            onClick={() => toggleSeat(seatNumber)}
                        >
                            {seatNumber}
                        </div>
                    );
                })}
            </div>

            <div className="actions">
                <button onClick={handleBooking} disabled={selectedSeats.length === 0}>
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};

export default TicketBookingPage;

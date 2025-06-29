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
    // const showTime = new Date().toISOString(); // optional: pass timestamp for identifying a show
    const rows = 5;
    const cols = 10;
    const totalSeats = rows * cols;

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]);
     const sessionId = sessionStorage.getItem("bookingSessionId");
useEffect(() => {
  const sessionId = sessionStorage.getItem("bookingSessionId");
  const userId = getUserId();

  if (sessionId && movieId && userId) {
    const clearRedisLock = async () => {
      try {
        await axios.post('http://localhost:4000/v1/clear-lock', {
          movieId,
          userId,
          sessionId
        }, {
          withCredentials: true,
        });
        console.log('Redis lock cleared after back navigation');
      } catch (err) {
        console.error("Error clearing redis lock on back", err);
      }
    };

    clearRedisLock();
  }
}, []);

    useEffect(() => {
        const fetchReservedSeats = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/v1/booked-seats`, {
                    params: {
                        movieId,
                        // showTime
                    
                    },
                      withCredentials: true
                });
                setReservedSeats(res.data.reservedSeats || []);
            } catch (err) {
                console.error('Failed to fetch reserved seats:', err);
            }
        };
        fetchReservedSeats();
    }, [movieId]);

    const toggleSeat = (seat) => {
        if (reservedSeats.includes(seat)) return; // can't toggle reserved seat

        setSelectedSeats((prev) =>
            prev.includes(seat)
                ? prev.filter((s) => s !== seat)
                : [...prev, seat]
        );
    };

    const handleBooking = async () => {
    const userId = getUserId();

    try {

        const reservedRes = await axios.get(`http://localhost:4000/v1/booked-seats`, {
            params: { movieId },
              withCredentials: true
        });
        const latestReserved = reservedRes.data.reservedSeats || [];

        const conflict = selectedSeats.some(seat => latestReserved.includes(seat));
        if (conflict) {
            alert("❌ Some of the seats you selected have already been booked by someone else.\nPlease refresh and select different seats.");
            return;
        }

        const res = await axios.post('http://localhost:4000/v1/book-ticket', {
            movieId,
            title,
            seats: selectedSeats,
            mediaType,
            userId,
            sessionId
        },
            {
  withCredentials: true,

        });

        if (res.status === 200) {
            navigate('/final-payment', {
                state: {
                    movieId,
                    title,
                    selectedSeats,
                    userId,
                    fromBooking:true,   
                    sessionId
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

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './TicketBookingPage.css';
import getUserId from '../../utils/getUserId';
import { toast } from 'react-toastify';
import useLogout from '../../Hooks/useLogout';

const TicketBookingPage = () => {
    const [loading,setloading] = useState(false);
    const { movieId, mediaType } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const logout=useLogout();
      const { movieTitle,date,theatre,theatreId,showTime,city } = location.state;
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
                const status = err.response?.status;
                const message = err.response?.data?.message;

                 if (status === 401) {
                   
                   toast.error(" Unauthorized inside clearRedisLock of useEffect(TicketBooking). Please log in again.");
                //    navigate('/'); 
                   logout();
                } else if (status === 403) {
                   toast.error(" Session expired inside clearRedisLock of useEffect(TicketBooking). Please sign in again.");
                //    navigate('/');
                logout();
                 } else {
                    toast.error(message);
                   }
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
                        date,
                        // theatre,
                        theatreId,
                        showTime
                    },
                    
                      withCredentials: true
                });
                setReservedSeats(res.data.reservedSeats || []);
            } catch (err) {
                const status = err.response?.status;
                const message = err.response?.data?.message;

                 if (status === 401) {
                   toast.error(" Unauthorized inside fetchReservedSeats in useEffect(ticketbooking). Please log in again.");
                    //  navigate('/'); 
                    logout();
                } else if (status === 403) {
                   toast.error(" Session expired inside fetchReservedSeats in useEffect(ticketbooking). Please sign in again.");
                //    navigate('/');
                logout();
                 } else{
                    toast.error(message );
                   }
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
    setloading(true)
    try {

        const reservedRes = await axios.get(`http://localhost:4000/v1/booked-seats`, {
            params: { movieId,
                      date,
                        // theatre,
                    theatreId,
                    showTime 
                    },
              withCredentials: true
        });
        const latestReserved = reservedRes.data.reservedSeats || [];

        const conflict = selectedSeats.some(seat => latestReserved.includes(seat));
        if (conflict) {
            setloading(false);
            alert("❌ Some of the seats you selected have already been booked by someone else.\nPlease refresh and select different seats.");
            return;
        }

        const res = await axios.post('http://localhost:4000/v1/book-ticket', {
            movieId,
            movieTitle,
            seats: selectedSeats,
            mediaType,
            userId,
            sessionId,
            date,
            theatre,
            theatreId,
            showTime,
        },
            {
            withCredentials: true,

        });

        if (res.status === 200) {
            navigate('/final-payment', {
                state: {
                    movieId,
                    movieTitle,
                    selectedSeats,
                    userId,
                    fromBooking:true,   
                    sessionId,
                    date,
                    theatre,
                    theatreId,
                    showTime,
                    city
                },
            });
            setloading(false);
        }
    } catch (err) {
              const status = err.response?.status;
              const message = err.response?.data?.message;

                 if (status === 401) {
                   toast.error(" Unauthorized inside handleBooking function(ticketbooking) for book seats and book ticket both. Please log in again.");
                //    navigate('/'); 
                   logout();
                } else if (status === 403) {
                   toast.error(" Session expired inside handleBooking function(ticketbooking) for book seats and book ticket both. . Please sign in again.");
                //    navigate('/');
                logout();
                 }
                 else if(status === 409) {
                    toast.error(message);
                 }
                 else {
                    toast.error(message);
                   }
        alert('Booking failed. Seat might already be taken.');
        console.error(err);
    }
    finally {
    setloading(false); // stop loader regardless of result
  }
};

    return (
        <div className="book-page">
            <h2>Select Seats for {movieTitle}</h2>
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
                <button onClick={handleBooking} disabled={selectedSeats.length === 0 || loading}>
                  { loading?"Processing..": "Proceed to Payment"}
                </button>
            </div>
        </div>
    );
};

export default TicketBookingPage;

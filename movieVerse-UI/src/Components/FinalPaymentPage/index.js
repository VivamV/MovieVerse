// src/pages/FinalPaymentPage.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FinalPaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movieId, title, selectedSeats, showTime,userId } = location.state || {};

    const handlePayment = async () => {
        try {
            await axios.post('http://localhost:4000/v1/finalize-booking', {
                movieId,
                title,
                seats: selectedSeats,
                showTime,
                userId
            });
            alert('Payment successful and booking confirmed!');
            navigate('/'); // or redirect to booking history
        } catch (err) {
            alert('Payment failed.');
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Final Payment</h2>
            <p><strong>Movie:</strong> {title}</p>
            <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
            <p><strong>Show Time:</strong> {new Date(showTime).toLocaleString()}</p>
            <button
                onClick={handlePayment}
                style={{ padding: '14px 30px', fontSize: '16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px' }}
            >
                Make Payment
            </button>
        </div>
    );
};

export default FinalPaymentPage;

// src/pages/FinalPaymentPage.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FinalPaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movieId, title, selectedSeats,userId } = location.state || {};

    const handlePayment = async () => {
        try {
            await axios.post('http://localhost:4000/v1/finalize-booking', {
                movieId,
                title,
                seats: selectedSeats,
                // showTime,
                userId
            });
            alert('Payment successful and booking confirmed!');
            navigate('/home'); // or redirect to booking history
        }
        catch (err) {
        if (err.response) {
            const { status, data } = err.response;
            if (status === 401) {
                alert(`⏰ ${data.message}`);
                navigate('/home'); // or force refresh to go back to seat selection
            } else if (status === 409) {
                alert(`❌ ${data.message}`);
                navigate('/home');
            } else {
                alert("Something went wrong. Please try again.");
            }
        } else {
            alert("Unable to reach server.");
        }
        console.error(err);
    }
    };

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            {/* <button onClick={}>Back</button> */}
            <h2>Final Payment</h2>
            <p><strong>Movie:</strong> {title}</p>
            <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
            {/* <p><strong>Show Time:</strong> {new Date(showTime).toLocaleString()}</p> */}
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

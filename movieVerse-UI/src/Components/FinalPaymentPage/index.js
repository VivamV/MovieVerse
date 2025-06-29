// src/pages/FinalPaymentPage.jsx

import React ,{useEffect} from 'react';
import { useLocation, useNavigate,Navigate } from 'react-router-dom';
import axios from 'axios';

const FinalPaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movieId, title, selectedSeats,userId,fromBooking,sessionId } = location.state || {};
    console.log("locaton.staate",location.state);
   console.log("fromBooking",fromBooking)


    const clearRedisLock = async () => {
        try {
            await axios.post('http://localhost:4000/v1/clear-lock', {
                movieId,
                userId,
                sessionId
            },{
  withCredentials: true,
});
            // lockCleared.current = true;
            console.log('Lock cleared');
        } catch (err) {
            console.error('Failed to clear lock', err);
        }
    };
       const handleBack = async () => {
        await clearRedisLock();
        navigate('/home');
    };
     useEffect(() => {
        console.log("useEffect final payment page");
const handleBeforeUnload = async (e) => {
  try {
    await fetch('http://localhost:4000/v1/clear-lock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movieId, userId,sessionId }),
       credentials: 'include',   
      keepalive: true 
    });
    //           e.preventDefault();
    //         e.returnValue = '';
    // setTimeout(()=>{},4000)
    navigate("/home");
  } catch (err) {
    console.error('Unload clear-lock failed:', err);
  }
};
        // const handlePopState = () => {
        //     // if (shouldClearLock.current) {
        //     console.log("pop state")
        //         clearRedisLock();
        //     // }
        // };

        window.addEventListener('beforeunload', handleBeforeUnload);
        // window.addEventListener('popstate', handlePopState);

        return () => {
             console.log("unmount final payment page",fromBooking,location.state);
            //       if(!fromBooking || fromBooking===undefined || location.state===undefined){
            //     console.log("unmoud mei cleard redis lock")
            //      clearRedisLock(); 
            // }
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // window.removeEventListener('popstate', handlePopState);
            
            // if (shouldClearLock.current) {
            //     clearRedisLock(); 
            // }

       
        };
        // console.log("useEffect final payment page");
        // return() => {
        //     console.log("unmount final payment page");
        // }

    }, [movieId, userId]);

      if (!fromBooking) {
    return <Navigate to="/home" replace />;
  }
    const handlePayment = async () => {
        try {
             const res = await axios.post('http://localhost:4000/v1/finalize-booking', {
                movieId,
                title,
                seats: selectedSeats,
                userId,
                sessionId
            },{
  withCredentials: true,
});

            if (res.status === 200) {
                alert('Payment successful and booking confirmed!');
                navigate('/home');
            }
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
           <button
                onClick={handleBack}
                style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    marginBottom: '20px',
                    background: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px'
                }}
            >
                 Back
            </button>
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

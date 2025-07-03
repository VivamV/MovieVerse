// src/pages/FinalPaymentPage.jsx

import React ,{useEffect,useState} from 'react';
import { useLocation, useNavigate,Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import useLogout from '../../Hooks/useLogout';

const FinalPaymentPage = () => {
    const [loading,setLoading]=useState(false)
    const location = useLocation();
    const navigate = useNavigate();
    const logout=useLogout();
//    coming from ticket booking
                    // movieId,
                    // movieTitle,
                    // selectedSeats,
                    // userId,
                    // fromBooking:true,   
                    // sessionId,
                    // date,
                    // theatre,
                    // theatreId,
                    // showTime,
                    // city

    const { movieId, movieTitle, selectedSeats,userId,fromBooking,sessionId,date,
                    theatre,
                    theatreId,
                    showTime,
                    city } = location.state || {};
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
             const status = err.response?.status;
            //  const message = err.response?.data?.message;
            if (status === 401) {
                toast.error(" Unauthorized. Please log in again.");
                // navigate('/'); 
                logout();
            } else if(status === 403) {
                toast.error(" Session expired. Please sign in again.");
                // navigate('/');
                logout();
            }
            else {
                alert("Something went wrong. Please try again.");
            }
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
        setLoading(true);
        try {
             const res = await axios.post('http://localhost:4000/v1/finalize-booking', {
                movieId,
                movieTitle,
                seats: selectedSeats,
                userId,
                sessionId,
                date,
                theatre,
                theatreId,
                showTime,
                city
            },{ withCredentials: true,});

            if (res.status === 200) {
                
                toast.success("Payment successful and booking confirmed!");
                alert('Payment successful and booking confirmed!');
                setLoading(false);
                navigate('/home');
            }
        }
        catch (err) {
        if (err.response) {
             const status = err.response?.status;
             const message = err.response?.data?.message;
            if (status === 401) {
                toast.error(" Unauthorized. Please log in again.");
                // navigate('/'); 
                logout();
            } else if(status === 403) {
                toast.error(" Session expired. Please sign in again.");
                // navigate('/');
                logout();
            }
            else if (status === 409) {
                toast.error(message);
                alert(`${message}`);
                navigate('/home');
            } 
            else if(status === 419){
                toast.error(message);
                alert(` ${message}`);
                navigate('/home');
            }
            else {
                alert("Something went wrong. Please try again.");
            }
        } 
        else {
            alert("Unable to reach server.");
        }
        console.error(err);
    }
    finally {
        setLoading(false);
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
            <p><strong>Movie:</strong> {movieTitle}</p>
            <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Theatre:</strong> {theatre}</p>
            <p><strong>City:</strong> {city}</p>
               <p><strong>Show Time:</strong>{showTime}</p>
            {/* <p><strong>Show Time:</strong> {new Date(showTime).toLocaleString()}</p> */}
            <button
                onClick={handlePayment}
                style={{ padding: '14px 30px', fontSize: '16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px' }}
             disabled={loading}
           >
              {loading ?'Payment Processing..':"Make Payment"}
            </button>
        </div>
    );
};

export default FinalPaymentPage;

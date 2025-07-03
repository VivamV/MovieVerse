import  React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import FooterComponent from  '../Components/Footer';
import HeaderComponent from '../Components/Header';
import HomeContainer from '../Container/Home';
import DetailsContainer from '../Container/Details';
import MoviesContainer from '../Container/Movies';
import TvSeriesContainer from '../Container/TvSeries';
import SearchContainer from '../Container/Search';
import TicketBookingPage from '../Components/TicketBookingPage';
import FinalPaymentPage from '../Components/FinalPaymentPage';
import LoginForm from '../Components/LoginForm';
import SignupForm from '../Components/SignupForm';
import ProtectedRoutes from './ProtectedRoutes';
import NoMatch from '../Container/NotFound';
import TheatreBookingPage from '../Container/Booking/TheatreBookingPage';
import Profile from '../Container/Profile';

import { useLocation,useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import useLogout from '../Hooks/useLogout';
const  RouteComponent = ()=>{
    // const clearRedisLock = async () => {
    //         try {
    //             await axios.post('http://localhost:4000/v1/clear-lock', {
    //                 movieId,
    //                 userId,
    //                 sessionId
    //             },{
    //              withCredentials: true,
    //              });
    //             // lockCleared.current = true;
    //             console.log('Lock cleared');
    //         } catch (err) {
    //              const status = err.response?.status;
    //             //  const message = err.response?.data?.message;
    //             if (status === 401) {
    //                 toast.error(" Unauthorized. Please log in again.");
    //                 navigate('/'); 
    //             } else if(status === 403) {
    //                 toast.error(" Session expired. Please sign in again.");
    //                 navigate('/');
    //             }
    //             else {
    //                 alert("Something went wrong. Please try again.");
    //             }
    //             console.error('Failed to clear lock', err);
    //         }
    //     };
const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const logout=useLogout();
  // Pages where Header & Footer should NOT be shown
  const hideHeaderFooter =
    path === '/' ||
    path === '/register' ||
    path==="/final-payment" ||
    path.startsWith('/book');

  // Pages where Logout button should be shown
  const showLogoutButton =
    path==="/final-payment" ||
    path.startsWith('/book');
  

  return (
    <>
      <ToastContainer />

      {!hideHeaderFooter && <HeaderComponent />}

      {showLogoutButton && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
          <button
            onClick={logout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      )}

      {children}

      {!hideHeaderFooter && <FooterComponent />}
    </>
  );
};

    return (
        <>
            <BrowserRouter>
            <Layout>
                <ToastContainer />
                {/* <HeaderComponent /> */}
                    <Routes>
                    <Route path="/" element={<LoginForm/>}></Route>
                    <Route path="/register" element={<SignupForm/>}></Route>
                    <Route element={<ProtectedRoutes/>}>
                        <Route path="/home" element={<HomeContainer />} />
                        <Route path="/movies" element={<MoviesContainer />} />
                        <Route path="/series" element={<TvSeriesContainer />} />
                        <Route path="/search" element={<SearchContainer />} />
                        <Route path="/details/:movieid/:mediatype" element={<DetailsContainer />} />
                        <Route path="/theatre-booking/:movieId/:mediaType" element={<TheatreBookingPage />} />
                        <Route path="/book/:movieId/:mediaType" element={<TicketBookingPage />} />
                        <Route path="/final-payment" element={<FinalPaymentPage />} />
                        <Route path="/profile/:userId" element={<Profile/>}/>
                        <Route path="*" element={<NoMatch />} />
                    </Route>
                    </Routes>        
                {/* <FooterComponent /> */}
                </Layout>
            </BrowserRouter>
        </>
    )
}

export default RouteComponent;
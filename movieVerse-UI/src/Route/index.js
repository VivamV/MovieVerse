import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FooterComponent from "../Components/Footer";
import HeaderComponent from "../Components/Header";
import HomeContainer from "../Container/Home";
import DetailsContainer from "../Container/Details";
import MoviesContainer from "../Container/Movies";
import TvSeriesContainer from "../Container/TvSeries";
import SearchContainer from "../Container/Search";
import ProtectedRoutes from "./ProtectedRoutes";
import NoMatch from "../Container/NotFound";
import Profile from "../Container/Profile";
import LoginForm from "../features/auth/LoginForm/LoginForm";
import SignupForm from "../features/auth/RegisterForm/SignupForm";
import TheatreBookingPage from "../features/booking/TheatreBookingPage/TheatreBookingPage";
import TicketBookingPage from "../features/booking/TicketBookingPage/TicketBookingPage";
import FinalPaymentPage from "../features/booking/FinalPaymentPage/FinalPaymentPage";
import TvSeriesStreaming from "../features/streaming/TvSeriesStreaming";
import StreamTesting from "../Container/StreamTesting/StreamTesting";

import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useLogout from "../Hooks/useLogout";
const RouteComponent = () => {
  const Layout = ({ children }) => {
    const location = useLocation();
    const path = location.pathname;
    const logout = useLogout();
    // Pages where Header & Footer should NOT be shown
    const hideHeaderFooter =
      path === "/" ||
      path === "/register" ||
      path === "/final-payment" ||
      path.startsWith("/book");

    // Pages where Logout button should be shown
    const showLogoutButton =
      path === "/final-payment" || path.startsWith("/book");

    return (
      <>
        {!hideHeaderFooter && <HeaderComponent />}

        {showLogoutButton && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "10px",
            }}
          >
            <button
              onClick={logout}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
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
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Layout>
          <Routes>
            <Route path="/" element={<LoginForm />}></Route>
            <Route path="/register" element={<SignupForm />}></Route>
            <Route element={<ProtectedRoutes />}>
              <Route path="/home" element={<HomeContainer />} />
              <Route path="/movies" element={<MoviesContainer />} />
              <Route path="/series" element={<TvSeriesContainer />} />
              <Route path="/search" element={<SearchContainer />} />
              <Route
                path="/details/:movieid/:mediatype"
                element={<DetailsContainer />}
              />
              <Route
                path="/theatre-booking/:movieId/:mediaType"
                element={<TheatreBookingPage />}
              />
              <Route
                path="/book/:movieId/:mediaType"
                element={<TicketBookingPage />}
              />
              <Route path="/final-payment" element={<FinalPaymentPage />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/tv-streaming" element={<TvSeriesStreaming />} />
              <Route path="/streamtesting" element={<StreamTesting/>}/>
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
};

export default RouteComponent;

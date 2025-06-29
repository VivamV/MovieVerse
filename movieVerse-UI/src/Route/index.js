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
const  RouteComponent = ()=>{

    return (
        <>
            <BrowserRouter>
                <HeaderComponent />
                    <Routes>
                    <Route path="/" element={<LoginForm/>}></Route>
                    <Route path="/register" element={<SignupForm/>}></Route>
                    <Route element={<ProtectedRoutes/>}>
                        <Route path="/home" element={<HomeContainer />} />
                        <Route path="/movies" element={<MoviesContainer />} />
                        <Route path="/series" element={<TvSeriesContainer />} />
                        <Route path="/search" element={<SearchContainer />} />
                        <Route path="/details/:movieid/:mediatype" element={<DetailsContainer />} />
                        <Route path="/book/:movieId/:mediaType" element={<TicketBookingPage />} />
                        <Route path="/final-payment" element={<FinalPaymentPage />} />
                        <Route path="*" element={<NoMatch />} />
                    </Route>
                    </Routes>        
                <FooterComponent />
            </BrowserRouter>
        </>
    )
}

export default RouteComponent;
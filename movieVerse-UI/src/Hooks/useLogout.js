import axios from 'axios';
import {useNavigate} from 'react-router-dom';
// import { toast } from 'react-toastify';

// we have 4 resources to clear->1. localstorage 2. sessionstorage 3. cookies(in backend) 4. redis
// when we want to remove resources->1.when user clicks on Logout button 2.JWT token expires and he make any api request
//Righ now there is no auth middleware->
//All cases(sabse imp hai localStorage k remove karna and moving to login page)
// 1.logout api works->cookies removed,storage removed,move to login page,redis lock remains open for a minute
// 2.logout api fails->cookies not removed,storage removed,move to login page,redis lock remains open for a minute
// 3.if there is auth middleware->then exactly as case2
const useLogout = () => {
      const navigate = useNavigate();
    const logoutUser = async () => {
  try {
    console.log("logout before");
    await axios.post('http://localhost:4000/v1/logout', {}, {
      withCredentials: true,
    });
    console.log("logout and cookies cleared");

    // Clear local and session storage
    localStorage.removeItem("userDetails");
    sessionStorage.removeItem("bookingSessionId");

    // redis lock->waise toh ye 1 min mei break ho hi jayega,so no need to break lock
    navigate('/');
  } catch (err) {
    // Edge case: server removes cookie but client fails due to JWT error
    // const status = err.response?.status;
    // const message = err.response?.data?.message;

    // if (status === 401) {
    //   toast.error("Unauthorized. Please log in again.");
    // } else if (status === 403) {
    //   toast.error("Session expired. Please sign in again.");
    // } else {
    //   toast.error(message || "Logout failed.");
    // }

    console.error('Logout failed:', err);
  } finally {
    // worst case ,suppose logout api failed ho gayi toh kam se kam ye dono toh remove ho jayngi
    localStorage.removeItem("userDetails");
    sessionStorage.removeItem("bookingSessionId");
    navigate('/');
  }
};
return logoutUser;
};


export default useLogout;

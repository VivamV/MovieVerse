import { useNavigate } from "react-router-dom";
import { logoutApp } from "../api/authAPI";
const useLogout = () => {
  const navigate = useNavigate();
  const logoutUser = async () => {
    try {
      const res = await logoutApp();
      localStorage.removeItem("userDetails");
      sessionStorage.removeItem("bookingSessionId");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("userDetails");
      sessionStorage.removeItem("bookingSessionId");
      navigate("/");
    }
  };
  return logoutUser;
};

export default useLogout;

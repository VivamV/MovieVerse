import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { checkAuth } from "../api/authAPI";

const ProtectedRoutes = () => {
  const [isAllowed, setIsAllowed] = useState(null);
  const user = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await checkAuth();
        if (res.status === 200 && user) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch (err) {
        setIsAllowed(false);
      }
    };

    verifyAuth();
  }, [user]);

  if (isAllowed === null) return <div>Loading...</div>;

  return isAllowed ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;

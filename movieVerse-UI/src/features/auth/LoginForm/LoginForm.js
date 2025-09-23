import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import sha256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import { v4 as uuidv4 } from "uuid";
import "./LoginForm.css";
import { login, checkAuth, refreshToken } from "../../../api/authAPI";

const LoginForm = () => {
  const sessionId = uuidv4();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(
          /[!@#$%^&*]/,
          "Password must contain at least one special character"
        )
        .matches(/[0-9]/, "Password must contain at least one numeric character")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const hashedPassword = sha256(values.password).toString(Hex);
        const payload = {
          email: values.email,
          password: hashedPassword,
        };
        const response = await login(payload);

        if (response.status === 200) {
          toast.success("Login Successful");
          localStorage.setItem("userDetails", JSON.stringify(response.data.user));
          sessionStorage.setItem("bookingSessionId", sessionId);
          navigate("/home");
        } else {
          alert("some unexpected error,cant Login,please Login again");
        }
      } catch (error) {
        console.error("There was an error logging in:", error);
        const status = error?.response?.status;
        const message = error?.response?.data?.message;

        if (status === 400 || status === 500 || status === 401 || status === 404) {
          toast.error(message);
        } else {
          alert(message);
        }
      }
    },
  });

  useEffect(() => {
    const checkLoginAuth = async () => {
      try {
        const user = localStorage.getItem("userDetails");
        const res = await checkAuth();

        if (res.status === 200 && user) {
          sessionStorage.setItem("bookingSessionId", sessionId);
          navigate("/home");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Error checking auth:", err);
        const status = err.response?.status;
        if (status === 401) {
          try {
            const refreshRes = await refreshToken();
            if (refreshRes.status === 200) {
              const res = await checkAuth();
              const user = localStorage.getItem("userDetails");
              if (res.status === 200 && user) {
                sessionStorage.setItem("bookingSessionId", sessionId);
                navigate("/home");
              }
            } else {
              navigate("/");
            }
          } catch {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      }
    };

    checkLoginAuth();
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="startup-notice">
          Note: This site is deployed on free platforms (Render,Vercel), so it may take a few seconds to start if idle.
        </div>

        <div className="brand-name"> MovieVerse</div>
        <h2>Sign in to your account</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            className="login-btn"
          >
            Sign in
          </button>
        </form>

        <p className="register-link">
          Not Registered? <Link to="/register">Register Now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

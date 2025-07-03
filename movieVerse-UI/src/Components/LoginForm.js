import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import { v4 as uuidv4 } from 'uuid';
import './LoginForm.css';

const LoginForm = () => {
  const sessionId = uuidv4();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
        .matches(/[0-9]/, 'Password must contain at least one numeric character')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const hashedPassword = sha256(values.password).toString(Hex);
        const payload = {
          email: values.email,
          password: hashedPassword
        };
        console.log("payload", payload);
        const response = await axios.post('http://localhost:4000/v1/login', payload, {
          withCredentials: true,
        });

        if (response.data.user) {
          localStorage.setItem("userDetails", JSON.stringify(response.data.user));
          sessionStorage.setItem("bookingSessionId", sessionId);
          navigate('/home');
        } else if (response.data.message === "User Not found") {
          toast.error("User not found, Please Register");
        } else if (response.data.message === "Invalid credentials") {
          toast.error("Invalid Credentials");
        }
      } catch (error) {
        console.error('There was an error logging in:', error);
        // alert('There was an error logging in');
        toast.error("error loggin in(inside catch)")
      }
    },
  });

  useEffect(() => {
  // const tokenExists = document.cookie.includes('token');
    const user = localStorage.getItem('userDetails');
    if (user) {
      sessionStorage.setItem("bookingSessionId", sessionId);
      navigate('/home');
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
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
      <ToastContainer />
    </div>
  );
};

export default LoginForm;

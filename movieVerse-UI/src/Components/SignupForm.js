import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import './SignupForm.css'; 

const SignupForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .min(3, 'Full name must be at least 3 characters long')
        .required('Full name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
        .matches(/[0-9]/, 'Password must contain at least one numeric character')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      const hashedPassword = sha256(values.password).toString(Hex);
      const hashedConfirmPassword = sha256(values.confirmPassword).toString(Hex);

      const payload = {
        fullname: values.fullname,
        email: values.email,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
      };

      try {
        const response = await axios.post('http://localhost:4000/v1/register', payload);
        if (response.data.user) {
          toast.success("User Registered, Please Login with your credentials");
        } else if (response.data.message === 'User Already exists') {
          toast.info("User Already exists, Please Login");
        }
        setTimeout(() => navigate('/'), 3000);
      } catch (error) {
        // console.error('There was an error registering:', error);
        toast.error("There was a error registering")
        // alert('There was an error registering');
      }
    },
  });

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="brand-name"> MovieVerse</div>
        <h2>Register for an account</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formik.values.fullname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.fullname && formik.errors.fullname && (
              <div className="error">{formik.errors.fullname}</div>
            )}
          </div>

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

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="error">{formik.errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="signup-btn"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Register
          </button>
        </form>

        <p className="signin-link">
          Already registered? <Link to="/">Sign in</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupForm;

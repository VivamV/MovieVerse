
import React,{useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import tw from 'tailwind-styled-components';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sha256 from 'crypto-js/sha256'; // npm install crypto-js
import Hex from 'crypto-js/enc-hex';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

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
        const payload={
          email:values.email,
          password:hashedPassword
        }
        const response = await axios.post('http://localhost:4000/v1/login', payload, {
  withCredentials: true,
});
        // console.log("login",response.data);
        // console.log("login ke time par toekn le lia",response.data.token);
        // console.log(response.data.user);
        // console.log("login message",response.data.message);
        if (response.data.user) {
          
          localStorage.setItem("userDetails", JSON.stringify(response.data.user));
          sessionStorage.setItem("bookingSessionId", sessionId);
          // Cookies.set('token', response.data.token);
          navigate('/home');
        } 
        else if(response.data.message==="User Not found"){
          // alert('User not found,Please Register ');
          toast.error("User not found,Please Register")
        }
        else if(response.data.message==="Invalid credentials")
        { 
          // alert("Invalid Credentials");
          toast.error("Invalid Credentials")
      }
      } catch (error) {
        // console.error('There was an error logging in:', error);
        // alert('There was an error logging in');
        toast.error("error loggin in(inside catch)")
      }
    },
  });
useEffect(() => {
  // const tokenExists = document.cookie.includes('token');
  const user = localStorage.getItem('userDetails');
  console.log("token exists userIn",user);
  if (user) {
    sessionStorage.setItem("bookingSessionId", sessionId);
    navigate('/home');
  }
}, []);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <p className="mx-auto h-10 w-auto" >BackpackerBlogs */}
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            
            </div>
            <div className="mt-2">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Sign in
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not Registered?
          <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Register Now
          </Link>
        </p>
      </div>
      <ToastContainer/>

    </div>
  );
};

export default LoginForm;

const Input = tw.input`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
focus:ring-indigo-600 sm:text-sm sm:leading-6`;
const Button = tw.button`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`;
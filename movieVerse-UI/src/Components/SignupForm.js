
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import app from '../utils/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sha256 from 'crypto-js/sha256'; // npm install crypto-js
import Hex from 'crypto-js/enc-hex';

const SignupForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    //   image: null,
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
        // console.log(response.data);
    console.log("response received in register",response)
        if (response.data.user) {
          // alert('User Registered, Please Login with your credentials');
         toast.success("User Registered, Please Login with your credentials")
          // console.log("toast.success",er)
     
        } else if (response.data.message === 'User Already exists') {
          // alert('User Already exists, Please Login');
          toast.info("User Already exists, Please Login")
          

        }
        setTimeout(()=>{navigate('/');},3000) 
      } catch (error) {
        // console.error('There was an error registering:', error);
        toast.error("There was a error registering")
        // alert('There was an error registering');
      }
    },
  });

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <p className="mx-auto h-10 w-auto">BackpackersBlogs</p> */}
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register for an account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {/* <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
            {imageperc > 0 && 'uploading ' + imageperc + '%'}
            <input
              type="file"
              id="img"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                formik.setFieldValue('image', e.target.files[0]);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formik.touched.image && formik.errors.image ? (
              <div className="text-red-600 text-sm mt-1">{formik.errors.image}</div>
            ) : null}
          </div> */}

          <div>
            <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
            <div className="mt-2">
              <input
                id="fullname"
                name="fullname"
                type="text"
                // autoComplete="fullname"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullname}
              />
              {formik.touched.fullname && formik.errors.fullname ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.fullname}</div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                // autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.confirmPassword}</div>
              ) : null}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already registered?
          <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default SignupForm;
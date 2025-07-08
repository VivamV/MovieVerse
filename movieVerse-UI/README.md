# 🍿 MovieVerse UI (Frontend)

React-based frontend for **MovieVerse** — a movie ticket booking application which provides details of a particular movie.

## 🚀 Features

- User registration and login with secure authentication(JWT tokens,refresh Tokens)
- Browse movies, theatres, shows, and timings
- Seat selection with redis locking mechanism
- Search Movies based on filters
- API based fetching of Movies
- Axios-based API communication with backend

## 🖥️ Tech Stack

- React.js 
- React Router DOM
- Bootstrap + Tailwind CSS
- Axios
- Formik & Yup
- React Toastify

## 🔧 Environment Variables

```env
# MovieVerse Service API
REACT_APP_MOVIEVERSE_SVC_API_BASE_URL=https://your-backend-url

REACT_APP_API_KEY=your_api_key
REACT_APP_NOT_SECRET_CODE=your_other_key
```
## 💻 Run Locally
- cd movieVerse-UI
- npm install
- npm start

## 🗂️ Branch Strategy
develop – Base branch for all feature work

prod – Production-ready deployment
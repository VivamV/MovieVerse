# 🎥 MovieVerse

**MovieVerse** is a full-stack movie ticket booking application where users can browse movies, view theatres and shows, book tickets with seat selection, and more. It supports authentication, secure payment flow, Redis-based seat locking, and deployment-ready environments.

---

## 🌐 Project Modules

### 🍿 Frontend – `movieVerse-UI`
- Built using **React.js** 
- Communicates with backend via Axios.
- Features user authentication, movie listing, seat selection, and filter/search capabilities.

### 🎬 Backend – `movieVerse-svc`
- Built with **Node.js + Express.js**
- Handles JWT-based authentication, session cookies, MongoDB-based data storage, Redis-based seat locks, and more.

---

## 🚀 Key Features

- ✅ User registration, login & token-based authentication (JWT & refresh tokens)
- 🎟️ Movie, Theatre, Show & Booking APIs
- 🧠 Seat selection with Redis-based locking
-  Adaptive Streaming of Videos
- 🔍 Movie search and filter
- 🔐 Secure cookie management
- 🔁 Environment support for INT & PROD
- 🔄 API-based architecture for scalability

---

## 🛠️ Tech Stack

| Frontend                    | Backend                       |
|----------------------------|-------------------------------|
| React.js                   | Node.js, Express.js           |
| React Router DOM           | MongoDB + Mongoose            |
| Axios                      | Redis (Upstash/local)         |
| Formik, Yup                | JWT Authentication            |
| React Toastify             | Nodemailer                    |

---

## 💻 Run Locally
for backend 

- cd movieVerse-svc
- npm install
- npm start

for frontend

- cd movieVerse-UI
- npm install
- npm start

## 🗂️ Branch Strategy
develop – Base branch for all feature work

prod – Production-ready deployment

## Roadmap / Major Future Enhancements
- Video Streaming of TV Shows(adaptive) more scalable
- Recommendation System on basis of user recent clicks
- Email confirmation + QR ticket generation
- Create admin dashboard (manage movies, shows, users)
- creating DockerFile and deployment using it
- Pipeline creation using tools like Github Actions

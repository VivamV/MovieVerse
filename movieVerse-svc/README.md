#  MovieVerse Service (Backend)

Node.js + Express-based backend for **MovieVerse** — a movie ticket booking app.

##  Features

- JWT-based authentication (secure, HTTP-only cookies)
- Refresh token handling
- Movie, Theatre, Show, and Booking APIs
- Redis-based seat lock and expiry logic
- MongoDB for persistent storage
- Environment-based config (INT, PROD)

##  Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Redis (Upstash )
- JWT

##  Environment Variables

```env
# Basic server config
PORT=any port
APP_ENV=INT or PROD 

# JWT secrets
SECRET_KEY=your_jwt_secret
REFRESH_SECRET_KEY=your_refresh_secret

# MongoDB and Redis
MONGO_URL=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string

# some other URLs
MOVIEVERSE_UI_BASE_URL=https://your-ui-url
```

##  Run Locally
- cd movieVerse-svc
- npm install
- npm start

##  Branch Strategy
develop – Base branch for all feature work

prod – Production-ready deployment only
import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  signinController,
  signupController,
} from "../controllers/authControllers.js";
import {
  myBlogs,
  allBlogs,
  createBlogs,
  deletecontroller,
  likecontroller
  ,updateBlog
} from "../controllers/blogController.js";
import redisClient from "../config/redisClient.js";

const router = express.Router();

import { BookingModel } from "../models/userSchema.js";

//Get Reserverd Seats
router.get('/v1/booked-seats', async (req, res) => {
  const { movieId } = req.query;

  try {
    // 👉 1. Fetch permanently booked from DB
    const bookings = await BookingModel.find({
      movieId,
      // showTime
    });

    const reservedSeatsFromDB = bookings.flatMap(b => b.seats);

    // 👉 2. Fetch temp locked seats from Redis for all users
    const keys = await redisClient.keys(`lock:${movieId}:*`);
    const redisSeats = [];

    for (const key of keys) {
      const value = await redisClient.get(key);
      if (value) {
        redisSeats.push(...JSON.parse(value));
      }
    }

    const allReservedSeats = [...new Set([...reservedSeatsFromDB, ...redisSeats])];

    res.status(200).json({ reservedSeats: allReservedSeats });
  } catch (error) {
    console.error("Fetch Reserved Seats Error:", error);
    res.status(500).json({ message: "Error fetching reserved seats" });
  }
});


router.post('/v1/finalize-booking', async (req, res) => {
  const { movieId, title, seats, userId, mediaType } = req.body;

  try {
    const redisKey = `lock:${movieId}:${userId}`;

    // ❗ Check if Redis key still exists
    const exists = await redisClient.exists(redisKey);
    if (!exists) {
      return res.status(401).json({ message: "⏰ Session Timeout. You were inactive too long. Please select seats again." });
    }

    const alreadyBooked = await BookingModel.find({
      movieId,
      seats: { $in: seats }
    });

    if (alreadyBooked.length > 0) {
      return res.status(409).json({ message: "Some seats are already booked." });
    }

    const newBooking = new BookingModel({
      movieId,
      title,
      seats,
      mediaType,
      userId
    });

    await newBooking.save();

    // 🔥 Delete only this user's lock
    await redisClient.del(redisKey);

    res.status(200).json({ message: "Booking successful" });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post('/v1/book-ticket', async (req, res) => {
  const { movieId, seats, userId } = req.body;

  console.log("Request received in book-ticket", req.body);

  const key = `lock:${movieId}:${userId}`;

  const existing = await redisClient.get(key);

  if (existing) {
    return res.status(409).json({ message: 'Seats already locked by you.' });
  }

  await redisClient.set(key, JSON.stringify(seats), { EX: 300, NX: true });

  res.status(200).json({ message: 'Seats locked.' });
});

// /v1/clear-lock
router.post('/v1/clear-lock', async (req, res) => {
  const { movieId, userId } = req.body;
  try {
    await redisClient.del(`lock:${movieId}:${userId}`);
    res.status(200).json({ message: 'Lock cleared' });
  } catch (err) {
    console.error('Error clearing lock:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/v1/clear-redis', async (req, res) => {
  try {
    await redisClient.flushAll(); // Same as FLUSHALL in redis-cli
    res.status(200).json({ message: 'All Redis keys cleared.' });
  } catch (err) {
    console.error('Redis flush error:', err);
    res.status(500).json({ message: 'Failed to clear Redis keys.' });
  }
});
router.get('/v1/get-redis', async (req, res) => {
  try {
    const keys = await redisClient.keys('*'); // Gets all keys

    const pipeline = redisClient.multi();
    keys.forEach(key => pipeline.get(key)); // Fetches values for each key

    const values = await pipeline.exec(); // Executes the pipeline

    // Combine keys and values into an object
    const result = keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (err) {
    console.error('Redis fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch Redis keys and values.' });
  }
});

// router.post("/v1/finalize-booking", async (req, res) => {
//   const { movieId, seats } = req.body;
//   const redisKey = `lock:${movieId}`;

//   // Save to database (mocked here)
//   await db.bookings.insertOne({ movieId, seats });

//   // Clear the lock
//   await redis.del(redisKey);
//   res.status(200).json({ message: "Ticket Booked Successfully" });
// });


router.post("/v1/register", signupController);
router.post("/v1/login", signinController);

router.post("/v1/createblogs", auth, createBlogs);

router.get("/v1/blogs", auth, allBlogs);


router.get("/v1/myblogs", auth, myBlogs);

router.put("/v1/myblogs/:postId", auth, updateBlog);

router.delete('/v1/myblogs/:postId',auth,deletecontroller);

router.post('/v1/like',auth,likecontroller);

export default router;

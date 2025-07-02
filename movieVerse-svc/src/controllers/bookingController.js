
import { BookingModel } from "../models/userSchema.js";
import redisClient from "../config/redisClient.js";
export const getReserverdSeats = async (req, res) => {
 const { movieId } = req.query;

  try {
    const bookings = await BookingModel.find({
      movieId,
      // showTime
    });

    const reservedSeatsFromDB = bookings.flatMap(b => b.seats);

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
};

export const lockSeats = async (req, res) => {
 try
 { 
  const { movieId, seats, userId,sessionId } = req.body;

  console.log("Request received in book-ticket", req.body);

  const key = `lock:${movieId}:${userId}:${sessionId}`;

  const existing = await redisClient.get(key);

  if (existing) {
    return res.status(409).json({ message: 'Seats already locked by you.' });
  }

  await redisClient.set(key, JSON.stringify(seats), { EX: 60, NX: true });

  res.status(200).json({ message: 'Seats locked.' });
}
catch (err) {
    console.error('Error locking seats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const finalBooking = async (req, res) => {
const { movieId, title, seats, userId, mediaType,sessionId } = req.body;

  try {
    const redisKey = `lock:${movieId}:${userId}:${sessionId}`;

    const exists = await redisClient.exists(redisKey);
    if (!exists) {
      return res.status(419).json({ message: "Session Timeout. You were inactive too long. Please select seats again." });
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

    await redisClient.del(redisKey);

    res.status(200).json({ message: "Booking successful" });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteLock=async (req, res) => {
  const { movieId, userId,sessionId } = req.body;
  try {
    await redisClient.del(`lock:${movieId}:${userId}:${sessionId}`);
    res.status(200).json({ message: 'Lock cleared' });
  } catch (err) {
    console.error('Error clearing lock:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


import { BookingModel,userModel } from "../models/userSchema.js";
import redisClient from "../config/redisClient.js";
import nodemailer from 'nodemailer';
export const getReserverdSeats = async (req, res) => {
  // coming in req.query->movieId,
  //                     date,
  //                   theatreId,
  //                   showTime 
 const { movieId,      date,
                        theatreId,
                        showTime } = req.query;
  try {
    const bookings = await BookingModel.find({
      movieId,
      theatreId,
      date,
      showTime
    });

    const reservedSeatsFromDB = bookings.flatMap(b => b.seats);
    const redisKeyPattern = `lock:${movieId}:*:*:${date}:${theatreId}:${showTime}`;
    const keys = await redisClient.keys(redisKeyPattern);
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
  // comiing in req.body
            // movieId,
            // movieTitle,->faltu
            // seats: selectedSeats,
            // mediaType,->faltu
            // userId,
            // sessionId,
            // date,
            // theatre,->faltu
            // theatreId,
            // showTime,
  const { movieId, seats, userId,sessionId, date,
                        theatreId,
                        showTime
                       } = req.body;

  console.log("Request received in book-ticket", req.body);

  const key = `lock:${movieId}:${userId}:${sessionId}:${date}:${theatreId}:${showTime}`;

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

// coming in req.body
                // movieId,
                // movieTitle,
                // seats: selectedSeats,
                // userId,
                // sessionId,
                // date,
                // theatre,
                // theatreId,
                // showTime,
                // city
const { movieId, movieTitle, seats, userId,sessionId,
                date,
                theatre,
                theatreId,
                showTime,
                city,
 } = req.body;

  try {
    const redisKey = `lock:${movieId}:${userId}:${sessionId}:${date}:${theatreId}:${showTime}`;

    const exists = await redisClient.exists(redisKey);
    if (!exists) {
      return res.status(419).json({ message: "Session Timeout. You were inactive too long. Please select seats again." });
    }

    const alreadyBooked = await BookingModel.find({
      movieId,
      seats: { $in: seats },
      theatreId,
      date,
      showTime
    });

    if (alreadyBooked.length > 0) {
      return res.status(409).json({ message: "Some seats are already booked." });
    }

    const newBooking = new BookingModel({
      movieId,
      movieTitle,
      seats,
      userId,
      theatreName: theatre,
      theatreId,
      city,
      date,
      showTime
    });

    await newBooking.save();

    await redisClient.del(redisKey);

    // send confirmation email to user
    // const user = await userModel.findById(userId);
    // console.log("process.env.EMAIL_USER",process.env.EMAIL_USER)
    // if (user && user.email) {
    //   const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: process.env.EMAIL_USER, // e.g. your_email@gmail.com
    //       pass: process.env.EMAIL_PASS  // use App Password or env var
    //     }
    //   });

    //   const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to: user.email,
    //     subject: '🎟️ Your Movie Ticket is Confirmed!',
    //     html: `
    //       <h3>Hello ${user.fullname},</h3>
    //       <p>Your ticket has been successfully booked for <strong>${movieTitle}</strong>.</p>
    //       <ul>
    //         <li><strong>Date:</strong> ${date}</li>
    //         <li><strong>Show Time:</strong> ${showTime}</li>
    //         <li><strong>Theatre:</strong> ${theatre}, ${city}</li>
    //         <li><strong>Seats:</strong> ${seats.join(', ')}</li>
    //       </ul>
    //       <p>Enjoy your movie! 🍿</p>
    //     `
    //   };

    //   await transporter.sendMail(mailOptions);
    // }


    res.status(200).json({ message: "Booking successful" });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const deleteLock=async (req, res) => {
//   const { movieId, userId,sessionId } = req.body;
//   try {
//     await redisClient.del(`lock:${movieId}:${userId}:${sessionId}:*`);
//     res.status(200).json({ message: 'Lock cleared' });
//   } catch (err) {
//     console.error('Error clearing lock:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// }
export const deleteLock = async (req, res) => {
  // coming in req.body -> movieId, userId, sessionId
  const { movieId, userId, sessionId } = req.body;

  try {
    // Step 1: Find all matching keys (based on movieId, userId, sessionId)
    const pattern = `lock:${movieId}:${userId}:${sessionId}:*`;
    const keys = await redisClient.keys(pattern);

    if (keys.length === 0) {
      return res.status(200).json({ message: 'No locks found to clear.' });
    }

    // Step 2: Delete each matching lock
    await Promise.all(keys.map(key => redisClient.del(key)));

    res.status(200).json({ message: 'Lock(s) cleared' });
  } catch (err) {
    console.error('Error clearing lock:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfileDetails=async(req,res)=>{
  const { userId } = req.query;

  try {
    // Fetch user info (excluding password)
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all bookings made by the user
    const bookings = await BookingModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      user,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching profile details:", error);
    res.status(500).json({ message: "Server error while fetching profile details" });
  }
}
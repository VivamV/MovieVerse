import { userModel } from "../models/userSchema.js";
import { BookingModel } from "../models/bookingSchema.js";
import redisClient from "../config/redisClient.js";
// import nodemailer from 'nodemailer';
export const getReserverdSeats = async (req, res) => {
  // coming in req.query->movieId,
  //                     date,
  //                   theatreId,
  //                   showTime
  const { movieId, date, theatreId, showTime } = req.query;
  try {
    console.log("inside getReserverdSeats Controller:");
    if (!movieId || !date || !theatreId || !showTime) {
      return res
        .status(400)
        .json({ message: "Missing required query parameters" });
    }
    const bookings = await BookingModel.find({
      movieId,
      theatreId,
      date,
      showTime,
    });

    const reservedSeatsFromDB = bookings.flatMap((b) => b.seats);

    const formattedDate = new Date(date).toISOString().split("T")[0];
    const trimmedTheatreId = theatreId.trim().toLowerCase();
    const trimmedShowTime = showTime.trim().toLowerCase();

    const redisKeyPattern = `lock|${movieId}|*|*|${formattedDate}|${trimmedTheatreId}|${trimmedShowTime}`;

    let cursor = "0";
    const redisSeats = [];

    do {
      const result = await redisClient.scan(cursor, {
        match: redisKeyPattern,
        count: 100,
      });

      cursor = result.cursor;

      for (const key of result.keys) {
        const parts = key.split("|");
        const redisMovieId = parts[1];

        const redisTheatreId = parts[5];
        const redisShowTime = parts[6];
        const redisDate = parts[4];
        // console.log("redisMovieId",redisMovieId);
        // console.log("redisTheatreId",redisTheatreId);
        // console.log("redisShowTime",redisShowTime);
        // console.log("redisDate",redisDate);
        // console.log("theatreId in getReservedSeats",trimmedTheatreId);
        // console.log("showTime in getReservedSeats",trimmedShowTime);
        // console.log("date in getReservedSeats",formattedDate);
        if (
          redisTheatreId !== trimmedTheatreId ||
          redisShowTime !== trimmedShowTime ||
          redisDate !== formattedDate ||
          redisMovieId !== movieId
        ) {
          // console.log("Skipping key due to mismatch:", key);
          continue;
        }

        const value = await redisClient.get(key);
        if (value) {
          redisSeats.push(...JSON.parse(value));
        }
      }
    } while (cursor !== "0");
    console.log("Got RedisSeats in getReservedSeats", redisSeats);
    const allReservedSeats = [
      ...new Set([...reservedSeatsFromDB, ...redisSeats]),
    ];

    res.status(200).json({ reservedSeats: allReservedSeats });
  } catch (error) {
    console.error("Fetch Reserved Seats Error:", error);
    res
      .status(500)
      .json({ message: "Something Went Wrong while fetching reserved seats" });
  }
};

export const lockSeats = async (req, res) => {
  try {
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
    const { movieId, seats, userId, sessionId, date, theatreId, showTime } =
      req.body;
    console.log("inside lockSeats Controller:");
    if (
      !movieId ||
      !Array.isArray(seats) ||
      seats.length === 0 ||
      !userId ||
      !sessionId ||
      !date ||
      !theatreId ||
      !showTime
    ) {
      return res
        .status(400)
        .json({ message: "Missing or invalid booking data" });
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];
    const trimmedTheatreId = theatreId.trim().toLowerCase();
    const trimmedShowTime = showTime.trim().toLowerCase();

    const key = `lock|${movieId}|${userId}|${sessionId}|${formattedDate}|${trimmedTheatreId}|${trimmedShowTime}`;

    const existing = await redisClient.get(key);

    if (existing) {
      return res
        .status(409)
        .json({ message: "Seats already locked by you,Please Refresh" });
    }
   
    await redisClient.set(key, JSON.stringify(seats), { EX: 60, NX: true });

    res.status(200).json({ message: "Seats locked." });
  } catch (err) {
    console.error("Error locking seats:", err);
    res.status(500).json({
      message: "Server error,Something went wrong while Locking seats",
    });
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
  const {
    movieId,
    movieTitle,
    seats,
    userId,
    sessionId,
    date,
    theatre,
    theatreId,
    showTime,
    city,
  } = req.body;
    console.log("inside finalBooking Controller:");
  try {
    if (
      !movieId ||
      !seats ||
      !userId ||
      !sessionId ||
      !date ||
      !theatreId ||
      !showTime ||
      !city ||
      !movieTitle ||
      !theatre
    ) {
      return res
        .status(400)
        .json({ message: "Missing required booking fields" });
    }

    
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const trimmedTheatreId = theatreId.trim().toLowerCase();
    const trimmedShowTime = showTime.trim().toLowerCase();

    const redisKey = `lock|${movieId}|${userId}|${sessionId}|${formattedDate}|${trimmedTheatreId}|${trimmedShowTime}`;

    const exists = await redisClient.exists(redisKey);
    if (!exists) {
      return res.status(419).json({
        message:
          "Session Timeout. You were inactive too long. Please select seats again.",
      });
    }

    const alreadyBooked = await BookingModel.find({
      movieId,
      seats: { $in: seats },
      theatreId,
      date,
      showTime,
    });

    if (alreadyBooked.length > 0) {
      return res
        .status(409)
        .json({ message: "Some seats are already booked." });
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
      showTime,
    });

    await newBooking.save();

    await redisClient.del(redisKey);

    // send confirmation email to user
    // const user = await userModel.findById(userId);

    // if (user && user.email) {
    //   const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS
    //     }
    //   });

    //   const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to: user.email,
    //     subject: 'Your Movie Ticket is Confirmed!',
    //     html: `
    //       <h3>Hello ${user.fullname},</h3>
    //       <p>Your ticket has been successfully booked for <strong>${movieTitle}</strong>.</p>
    //       <ul>
    //         <li><strong>Date:</strong> ${date}</li>
    //         <li><strong>Show Time:</strong> ${showTime}</li>
    //         <li><strong>Theatre:</strong> ${theatre}, ${city}</li>
    //         <li><strong>Seats:</strong> ${seats.join(', ')}</li>
    //       </ul>
    //       <p>Enjoy your movie! </p>
    //     `
    //   };

    //   await transporter.sendMail(mailOptions);
    // }

    res.status(200).json({ message: "Booking successful" });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({
      message: "Server error,Something went wrong can't book yout ticket",
    });
  }
};

export const deleteLock = async (req, res) => {
  // coming in req.body -> movieId, userId, sessionId
  const { movieId, userId, sessionId } = req.body;
  try {
    console.log("inside deleteLock Controller:");
    if (!movieId || !userId || !sessionId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const pattern = `lock|${movieId}|${userId}|${sessionId}|*`;
    let cursor = "0";
    let keysToDelete = [];

    do {
      const result = await redisClient.scan(cursor, {
        match: pattern,
        count: 100,
      });

      cursor = result.cursor;

      const filteredKeys = result.keys.filter((key) => {
        const parts = key.split("|");
        return (
          parts[0] === "lock" &&
          parts[1] === movieId &&
          parts[2] === userId &&
          parts[3] === sessionId
        );
      });

      keysToDelete.push(...filteredKeys);
    } while (cursor !== "0");
    console.log("keysToDelete in deleteLock Controller:", keysToDelete);
    if (keysToDelete.length === 0) {
      return res.status(200).json({ message: "No locks found to clear." });
    }
    await Promise.all(keysToDelete.map((key) => redisClient.del(key)));
    res.status(200).json({ message: "Lock cleared" });
  } catch (err) {
    console.error("Error clearing lock:", err);
    res.status(500).json({
      message: "Server error,Something went wrong while clearing Lock",
    });
  }
};

export const getProfileDetails = async (req, res) => {
  const { userId } = req.query;

  try {
    console.log("inside getProfileDetails Controller:",userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await BookingModel.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      user,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching profile details:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching profile details" });
  }
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userSchema.js";
// import redisClient from "../config/redisClient.js";

export const signupController = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  try {
    console.log("inside signupController:,APP_ENV", process.env.APP_ENV);
    if (!fullname || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All fields are required,Please enter all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists,Please login" });
    }
    console.log("before hashing password in signupController:");
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      fullname,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Something went wrong, can't register" });
  }
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("inside signinController:", email);
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User Not found,Please Register" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid Login credentials" });
    }
    console.log("before setting cookie in signinController:APP_ENV", process.env.APP_ENV);
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "2d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.APP_ENV === "PROD" || process.env.APP_ENV === "INT",
      sameSite:
        process.env.APP_ENV === "PROD" || process.env.APP_ENV === "INT"
          ? "None"
          : "Strict",
      maxAge: 30 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.APP_ENV === "PROD" || process.env.APP_ENV === "INT",
      sameSite:
        process.env.APP_ENV === "PROD" || process.env.APP_ENV === "INT"
          ? "None"
          : "Strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    console.log("Cookies set in signinController:");
    // await redisClient.set(`refresh:${existingUser._id}`, refreshToken, { EX:50 });
    const userDetails = {
      userId: existingUser._id,
    };
    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Something went wrong,Cant login" });
  }
};

export const logoutController = async (req, res) => {
  console.log("inside logoutController: APP_env", process.env.APP_ENV);
  const isProdOrInt =
    process.env.APP_ENV === "PROD" || process.env.APP_ENV === "INT";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProdOrInt,
    sameSite: isProdOrInt ? "None" : "Strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProdOrInt,
    sameSite: isProdOrInt ? "None" : "Strict",
  });
  // await redisClient.del(`refresh:${userId}`);
  res.status(200).json({ message: "Logged out" });
};

export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("inside refreshTokenController:");
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    const decoded = jwt.decode(refreshToken);
    const expInSec = decoded.exp;
    const nowInSec = Math.floor(Date.now() / 1000);
    const ttl = expInSec - nowInSec;
    console.log("ttl in refreshTokenController:", ttl);
    if (ttl < 30 * 60) {
      return res.status(403).json({ message: "refresh token Session expired" });
    }
    // (Optional) Check against Redis
    // const savedToken = await redisClient.get(`refresh:${payload.id}`);
    // if (savedToken !== refreshToken) {
    //   return res.status(403).json({ message: "Invalid refresh token" });
    // }

    const newAccessToken = jwt.sign(
      { email: payload.email, id: payload.id },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.APP_ENV === "PROD" || process.env.APP_ENV === "INT",
      sameSite:
        process.env.APP_ENV === "PROD" || process.env.APP_ENV === "INT"
          ? "None"
          : "Strict",
      maxAge: 30 * 60 * 1000,
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const checkAuthController = (req, res) => {
  console.log("inside checkAuthController:");
  return res.status(200).json({ message: "Token is valid" });
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userSchema.js";
// import Cookies from "js-cookie";

export const signupController = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords don't match" });
    }

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .send({ message: "User registered successfully", user: true });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong, can't register" });
  }
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("signinController");
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.json({ message: "User Not found" });
    }
    console.log("before mavh password",existingUser.password)
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    console.log("after match password",matchPassword)
    if (!matchPassword) {
      console.log("matchPassword",matchPassword)
      return res.json({ message: "Invalid credentials" });
    }
    console.log("before token",matchPassword)
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10s" }
    );
    console.log("after token",token)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
    });
    console.log("after setting cookie")
    // Cookies.set('token',token)
    const userDetails = {
      userId: existingUser._id,
    };
    res.status(201).json({ user: userDetails });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logoutController = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out" });
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userSchema.js";
import Cookies from 'js-cookie'

export const signupController = async (req, res) => {
  const { fullname, email, password ,profileimagePath} = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({
      fullname: fullname,
      email: email,
      password: hashedPassword,
      profileimageURL:profileimagePath
    });
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong,can't register"});
  }
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.json({ message: "User Not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY, 
        { expiresIn: '15m' }
    );
    res.cookie('token', token);
    Cookies.set('token',token)
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


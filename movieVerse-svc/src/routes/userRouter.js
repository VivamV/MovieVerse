import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  logoutController,
  signinController,
  signupController,
} from "../controllers/authControllers.js";
import {
  lockSeats,
  finalBooking,
  getReserverdSeats,
  deleteLock,
  getProfileDetails
} from "../controllers/bookingController.js";

const userRouter = express.Router();

userRouter.post("/register", signupController);

userRouter.post("/login", signinController);

userRouter.post('/logout', logoutController);/*can remove auth middleware from here*/

userRouter.get('/booked-seats',auth, getReserverdSeats);

userRouter.post('/book-ticket',auth,lockSeats);

userRouter.post('/finalize-booking',auth,finalBooking);

userRouter.post('/clear-lock',auth,deleteLock);

userRouter.get("/profile-details",auth,getProfileDetails);

export default userRouter;

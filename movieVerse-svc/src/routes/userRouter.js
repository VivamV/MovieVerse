import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  logoutController,
  signinController,
  signupController,
  refreshTokenController,
  checkAuthController
} from "../controllers/authControllers.js";
import {
  lockSeats,
  finalBooking,
  getReserverdSeats,
  deleteLock,
  getProfileDetails
} from "../controllers/bookingController.js";

const userRouter = express.Router();

//healthCheck route
userRouter.get("/health-check", (req, res) => res.status(200).json({ message: "Server is healthy" }));
// auth routes
userRouter.post("/register", signupController);

userRouter.post("/login", signinController);

userRouter.post('/logout', logoutController);

userRouter.post('/refresh-token',refreshTokenController);

userRouter.get('/check-auth',auth,checkAuthController);

// booking routes
userRouter.get('/booked-seats',auth, getReserverdSeats);

userRouter.post('/book-ticket',auth,lockSeats);

userRouter.post('/finalize-booking',auth,finalBooking);

userRouter.post('/clear-lock',auth,deleteLock);

//userRoutes
userRouter.get("/profile-details",auth,getProfileDetails);

userRouter.get("/get-user-id",auth,(req,res)=>{res.status(200).json({userId:req.user.id})});

export default userRouter;

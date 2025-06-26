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

const router = express.Router();

router.post("/v1/register", signupController);
router.post("/v1/login", signinController);

router.post("/v1/createblogs", auth, createBlogs);

router.get("/v1/blogs", auth, allBlogs);


router.get("/v1/myblogs", auth, myBlogs);

router.put("/v1/myblogs/:postId", auth, updateBlog);

router.delete('/v1/myblogs/:postId',auth,deletecontroller);

router.post('/v1/like',auth,likecontroller);

export default router;

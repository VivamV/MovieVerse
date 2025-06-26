import { request } from "express";
import { userModel, postsModel } from "../models/userSchema.js";

export const createBlogs = async (req, res) => {
  try {

    const { id } = req.user;
    const  imageURL = req.body.imagePath;
    const  description = req.body.description;

    if(description.length===0)/*we cant leave description empty*/
    { 
      res.status(500).json({ message: 'Error creating blog post,description empty', error });
    }

    const newPost = new postsModel({ user: id, caption:description, imageURL:imageURL });

    await newPost.save();
    res.status(200).send({message:"Blog Creation Successful"});
  } 
  catch (err) {
    res.status(500).json({ message: "error", err });
  }
};

export const allBlogs = async (req, res) => {
  try {
    const postCount = req.query.postCount || 1;
    const totalCount = await postsModel.countDocuments();
    const totalPost = 3;
    const posts = await postsModel.find({}).populate("user", "fullname profileimageURL")
      .sort({createdAt:-1})
      .skip((postCount - 1) * totalPost)
      .limit(totalPost);

    res.status(200).json({ data:posts, totalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const myBlogs = async (req, res) => {
  const { id } = req.user;
  try {
    const myPosts = await postsModel.find({user: id }).populate("user", "fullname profileimageURL").sort({createdAt:-1});
    return res.status(200).json({ data:myPosts });
  } catch (err) {
    return res.status(500).json({ message: "error", err });
  }
};

export const deletecontroller=async (req, res) => {
  try {
    const postId = req.params.postId;
    await postsModel.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const likecontroller=async (req, res) => {

  try {
    const { postId, loginId } = req.body;
    const post = await postsModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const isLiked = post.likes.includes(loginId);
    if (isLiked) {
      post.likes.pull(loginId);
    } else {
      post.likes.push(loginId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes});
  } catch (error) {
    res.status(500).json({ message: 'Error updating likes', error });
  }
}

export const updateBlog = async (req, res) => {
  try {
    const { postId } = req.params;
    const  imageURL = req.body.imageURL;
    const  description = req.body.description;

   if(description.length===0)/*we cant leave description empty*/
   { res.status(500).json({ message: 'Error updating blog post,description empty', error });}

    const updatedBlog = await postsModel.findByIdAndUpdate(postId, { caption: description, imageURL: imageURL }, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post', error });
  }
};

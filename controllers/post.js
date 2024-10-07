const mongoose = require("mongoose");
const Post = require("../models/post-model");
const User = require("../models/user-model");

const addPost = async (req, res) => {
  try {
    const { text, image, postedBy, username, userProfilePic } = req.body;

    if (!postedBy) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newPost = await new Post({
      text: text,
      image: image,
      postedBy: postedBy,
      username: username,
      userProfilePic: userProfilePic,
    });
    await newPost.save();
    return res.status(200).json({ message: "Post created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = await Post.findByIdAndDelete(req.params.id);
    if (!postId) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    console.log(post);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // If authorized, update the post
    await Post.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text, img: req.body.img },
      { new: true }
    );
    return res.status(200).json({ message: "The post has been updated" });
  } catch (err) {
    return res.status(500).json({ message: "Error updating post", error: err });
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text, userId, username, userProfilePIC } = req.body;
    const postId = req.params.id;

    const user = await User.findById(userId);
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated", user });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }
    const reply = { userId, username, userProfilePIC, text };
    post.replies.push(reply);
    console.log(post.replies);
    await post.save();
    res.json({ message: "Reply added successfully", post });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteReply = async (req, res) => {
  try {
    const replyId = req.params.id;
    console.log(replyId);
    const { userId, postId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const post = await Post.findById(postId);
    console.log(post);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!replyId) {
      return res.status(404).json({ message: "Reply not found" });
    }

    post.replies.pull(replyId);
    await post.save();

    res.json({ message: "Reply deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { replyToPost, deleteReply, updatePost, addPost, deletePost };

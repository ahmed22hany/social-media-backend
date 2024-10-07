const Post = require("../models/post-model");
const User = require("../models/user-model");

const addPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    const userId = req.user._id;
    const username = req.user.username;
    const userProfilePic = req.user.profilePic;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const newPost = new post({ text, image, userId, username, userProfilePic });
    await newPost.save();
    return newPost;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

    const deletePost = async (req, res) => {
        try {
          const deletedPost = await Post.findByIdAndDelete(req.params.id);
          if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
        
          res.status(200).json({ message: 'Post deleted' });
        } catch (err) {
          res.status(500).json({ message: 'Server error', error: err.message });
        }
      };
      
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is authorized to update the post
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
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
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const username = req.user.username;
    const userProfilePIC = req.user.profilePic;

    const user = await user.findById(userId);
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const post = await post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }
    const reply = { userId, username, userProfilePIC, text };
    post.replies.push(reply);
    await post.save();
    res.json({ message: "Reply added successfully", post });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteReply = async (req, res) => {
  try {
    const postId = req.params.id;
    const replyId = req.params.replyId;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const post = await post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = await post.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }
    await reply.remove();
    await post.save();
    res.json({ message: "Reply deleted successfully", reply });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { replyToPost, deleteReply, updatePost, addPost, deletePost };

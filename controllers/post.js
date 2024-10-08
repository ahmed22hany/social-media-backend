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

const getFeedPost = async (req, res) => {
  try {
    const currentUser = await User.findById(req.body._id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch posts created by the current user
    const userPosts = await Post.find({ postedBy: currentUser._id.toString() });
    console.log("User's Posts: ", userPosts); // Log user posts

    // Fetch posts from friends using Promise.all
    const friendPosts = await Promise.all(
      currentUser.following.map(async (friendId) => {
        const friendPost = await Post.find({ postedBy: friendId });
        console.log(`Posts by friend ${friendId}: `, friendPost); // Log each friend's posts
        return friendPost;
      })
    );

    // Concatenate user posts and friend posts
    const allPosts = userPosts.concat(...friendPosts);
    console.log("All Posts: ", allPosts); // Log all combined posts

    res.json(allPosts);
  } catch (err) {
    console.error(err); // Better error logging
    res.status(500).json({ message: "Server error" });
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
const likePost = async (req, res) => {
  try {
    const { id } = req.params; 
    const { userId } = req.body; 

    // Find the post by its ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

 

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({ message: `Valid User ID is required and must be a string. Received: ${userId}` });  
}
const user = await User.findById(userId);
console.log(user);
if (!user) {
  return res.status(404).json({ message: `User with ID ${userId} not found `});
}
    // Check if the user has already liked the post
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // If already liked, remove the user's like
      post.likes.pull(userId);
    } else {
      // If not liked, add the user's like
      post.likes.push(userId);
    }

    // Save the updated post
    await post.save();

    // Send a response after saving
    const message = isLiked ? "unlike" : "like";
    res.status(200).json({ message });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};




module.exports = { replyToPost, deleteReply, updatePost, addPost, deletePost,likePost };


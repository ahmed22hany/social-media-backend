const express = require("express");
const router = express.Router();
const {
  replyToPost,
  deleteReply,
  updatePost,
  addPost,
  deletePost,

  likePost,
  getFeedPost
} = require("../controllers/post");

router.post("/", addPost);
router.post("/reply/:id", replyToPost);
router.get("/feed", getFeedPost);
router.delete("/delete/reply/:id", deleteReply);
router.put("/:id", updatePost);
router.delete("/delete/:id", deletePost);
router.post('/like/:id', likePost);

module.exports = router;

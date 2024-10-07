const express = require("express");
const {
  replyToPost,
  deleteReply,
  updatePost,
  addPost,
  deletePost,
} = require("../controllers/post");
const router = express.Route();

router.post("/", addPost);
router.post("/reply", replyToPost);
router.delete("/delete/:id", deleteReply);
router.put("/:id", updatePost);
router.delete("/delete/:id", deletePost);

module.exports = router;

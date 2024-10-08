const express = require("express");
const {
  replyToPost,
  deleteReply,
  updatePost,
  addPost,
  deletePost,
  likePost,
 
} = require("../controllers/post");
const router = express.Router();

router.post("/", addPost);
router.post("/reply/:id", replyToPost);
router.delete("/delete/reply/:id", deleteReply);
router.put("/:id", updatePost);
router.delete("/delete/:id", deletePost);
router.post('/like/:id', likePost);

module.exports = router;

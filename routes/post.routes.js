const express = require("express");
const {
  replyToPost,
  deleteReply,
  updatePost,
  addpost,
} = require("../controllers/post");
const router = express.Route();

router.post("/", addpost);
router.post("/reply", replyToPost);
router.delete("/delete", deleteReply);
router.put("/:id", updatePost);

module.exports = router;

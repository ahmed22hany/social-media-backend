const express = require("express");
const router = express.Router();
const { editComment } = require("../controllers/editComment.js");

router.put("/:postID/replies/:replyID", editComment);

module.exports = router;

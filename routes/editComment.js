const express = require("express");
const router = express.Router();
const { editComment } = require("../controllers/editComment.js");

router.put("/", editComment);

module.exports = router;

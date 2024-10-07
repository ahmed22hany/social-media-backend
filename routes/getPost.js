const express = require("express");
const router = express.Router();
const { getPost } = require("../controllers/getPost.js");

router.get("/", getPost);

module.exports = router;
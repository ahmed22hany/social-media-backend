const express = require("express");
const router = express.Router();

const { getPost } = require("../controllers/getPost.js");

router.get("/:id", getPost);

module.exports = router;

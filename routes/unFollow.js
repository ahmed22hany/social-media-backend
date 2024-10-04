const express = require("express");
const router = express.Route();
const unfollowController = require("../controllers/unFollow");

router.post("/", unfollowController);

module.exprts = router;

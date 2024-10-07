const express=require("express");
const {replyToPost , deleteReply} = require("../controllers/post");
const router= express.Route();

router.post("/reply",replyToPost);
router.delete("/delete",deleteReply )

module.exports=router;
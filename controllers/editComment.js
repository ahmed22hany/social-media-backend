const postModel = require("../models/post-model");

const editComment = async (req, res) => {
  const { postID, replyID } = req.params;
  const { newReply } = req.body;
  
  try {
    //get the post from the DataBase
    const post = await postModel.findById(postID);

    //validate post
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    //get the reply from post replies
    const reply = post.replies.find(
      (reply) => reply._id.toString() === replyID
    );

    //validate the reply
    if (!reply) {
      return res.status(404).json({ message: "Reply not found!" });
    }

    //update the reply of the post
    reply.text = newReply;

    //save the changes to the DataBase
    await post.save();

    //return success message
    return res.status(200).json({ message: "Reply edited successfully", post });
  } catch (error) {
    return res.status(500).json({ message: "reply not found!" });
  }
};

module.exports = {
  editComment,
};

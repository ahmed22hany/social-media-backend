const postModel = require("../models/post-model");

const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }
    return res.status(200).json({ message: "Post found", post });
  } catch (error) {
    return res.staus(500).json({ message: "Error fetching post!", error });
  }
};

module.exports = {
  getPost,
};

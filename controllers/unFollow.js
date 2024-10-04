const userModel = require("../models/user-model");

const unfollowUser = async (req, res) => {
  const { userID, unfollowUserID } = req.body;

  try {
    //get the user from the DataBase
    const user = await userModel.findById(userID);
    const userToUnfollow = await userModel.findById(unfollowUserID);

    //validate the IDs
    if (!user || !unfollowUserID) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    //check if not following the user
    if (!user.following.include(unfollowUserID)) {
      return res.status(404).json({ message: "User is not Followed By You" });
    }

    //make the unfollow operation
    user.following.pull(unfollowUserID);
    userToUnfollow.followers.pull(userID);

    //save to the DataBase
    await user.save();
    await userToUnfollow.save();

    return res.status(200).json({ message: "User Unfollowed Successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Error" });
  }
};

module.exprts = { unfollowUser };

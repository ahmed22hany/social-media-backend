const userModel = require("../models/user-model");

const followUser = async (req, res) => {
  const { userID, followUserID } = req.body;

  try {
    //get the users from the DataBase
    const user = await userModel.findById(userID);
    const userToFollow = await userModel.findById(followUserID);
   
    //validate the IDs
    if (!userID || !userToFollow) {
      return res.status(404).json({ message: "user not found!" });
    }

    //check if already following the user
    if (user.following.includes(followUserID)) {
      return res.status(404).json({ message: "User Already Followed" });
    }

    //make the follow operation
    user.following.push(followUserID);
    userToFollow.followers.push(userID);

    //save to the DataBase
    await user.save();
    await userToFollow.save();

    return res.status(200).json({ message: "User Followed Successfully" });
  } catch (error) {
    return res.status(404).json({ message: "User not found in our DataBase!" });
  }
};

module.exports = {
  followUser,
};

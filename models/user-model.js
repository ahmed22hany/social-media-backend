const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 6, required: true },
    profilePic: { type: String, default: "" },
    followers: { type: [string], default: [] },
    following: { type: [string], default: [] },
    bio: { type: string, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

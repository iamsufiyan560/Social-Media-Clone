// services/userService.js

import User from "../models/userModel.js";

async function getUserDetails(userId) {
  try {
    const user = await User.findById(userId);
    return user
      ? {
          _id: user._id,
          name: user.name,
          profilePic: user.profilePic,
          username: user.username,
        }
      : null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

async function getFollowersDetails(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const followerDetailsPromises = user.followers.map((userId) =>
    getUserDetails(userId)
  );
  return Promise.all(followerDetailsPromises);
}

async function getFollowingDetails(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const followingDetailsPromises = user.following.map((userId) =>
    getUserDetails(userId)
  );
  return Promise.all(followingDetailsPromises);
}

export { getFollowersDetails, getFollowingDetails };

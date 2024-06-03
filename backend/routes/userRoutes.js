import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/:userId/following", protectRoute, userController.getFollowing);
router.get("/:userId/followers", protectRoute, userController.getFollowers);

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, updateUser);

router.put("/freeze", protectRoute, freezeAccount);

export default router;

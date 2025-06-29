import express from "express";
const router = express.Router();
import {
  signup,
  login,
  getUser,
  sendOtp,
  googleAuth,
  forgotPass,
  verifyOtp,
  verifyOtpToken,
  resetPass,
  getUserProfile,
  updateUserProfile,
  checkAuth,
  logout,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

router.post("/send-otp", sendOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// router.post('/googleAuth', googleAuth);
router.route("/googleAuth").post(googleAuth);
router.get("/get-user", verifyToken, getUser);

router.post("/forgotPass", forgotPass);
router.post("/verifyOtp", verifyOtp);
router.post("/verifyOtpToken", verifyOtpToken);
router.post("/resetPass", resetPass);

router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

router.post('/check-auth', checkAuth);
export default router; 
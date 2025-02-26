import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { verifyEmail } from "../utils/user.util.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/google/callback", async (req, res) => {
  const body = req.body;
  console.log(req.headers.authorization);

  return res
    .status(200)
    .json({ message: "Google callback received", data: body });
});
export default router;

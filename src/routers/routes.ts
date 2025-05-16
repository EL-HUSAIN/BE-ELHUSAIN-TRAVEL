import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  changePasswordHandler,
} from "../handler/user.handler";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", (req, res) => {
  res.send("Selamat Datang di API Visa Elhusein");
});

// Public endpoints
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

// Protected endpoint
router.put("/change-password", authMiddleware, changePasswordHandler);

export default router;

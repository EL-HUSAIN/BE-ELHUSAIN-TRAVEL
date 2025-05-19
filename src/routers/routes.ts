import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  changePasswordHandler,
} from "../handler/user.handler";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  adminLoginHandler,
  registerAdminHandler,
} from "../handler/admin.handler";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  listPostsHandler,
  updatePostHandler,
} from "../handler/post.handler";
import { upload } from "../middleware/upload.middleware";

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

// Admin endpoints
router.post("/admin/login", adminLoginHandler);
router.post(
  "/admin/register",
  authMiddleware,
  adminMiddleware,
  registerAdminHandler
);

// Post endpoints
router.post(
  "/posts",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  createPostHandler
);
router.get("/posts", listPostsHandler);
router.get("/posts/:id", getPostHandler);
router.put("/posts/:id", authMiddleware, adminMiddleware, updatePostHandler);
router.delete("/posts/:id", authMiddleware, adminMiddleware, deletePostHandler);

export default router;

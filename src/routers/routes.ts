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
  deleteAdminHandler,
  getAdminByIdHandler,
  getAdminsHandler,
  registerAdminHandler,
  updateAdminHandler,
} from "../handler/admin.handler";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  createPostHandler,
  deletePostHandler,
  getPostBySlugHandler,
  getPostHandler,
  listPostsHandler,
  updatePostHandler,
} from "../handler/post.handler";
import { upload } from "../middleware/upload.middleware";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesByIdHandler,
  getCategoriesHandler,
  getCategoryBySlugHandler,
  updateCategoryHandler,
} from "../handler/category.handler";
import {
  createTourPackageHandler,
  deleteTourPackageHandler,
  getTourPackageByIdHandler,
  getTourPackageBySlugHandler,
  getTourPackagesHandler,
  updateTourPackageHandler,
} from "../handler/tourPackage.handler";
import { uploadPackageImage } from "../middleware/uploadPackages.middleware";
import {
  createTourImageHandler,
  deleteTourImageHandler,
  getTourImageByIdHandler,
  getTourImagesByPackageHandler,
  updateTourImageHandler,
} from "../handler/tourImage.handler";

const router = Router();

router.get("/", (req, res) => {
  res.send("Selamat Datang di API Travel Elhusein — Versi 2.0 (terbaru)");
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
router.get("/admin/:id", authMiddleware, adminMiddleware, getAdminByIdHandler);
router.get("/admin", authMiddleware, adminMiddleware, getAdminsHandler);
router.put("/admin/:id", authMiddleware, adminMiddleware, updateAdminHandler);
router.delete(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  deleteAdminHandler
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
router.get("/posts/slug/:slug", getPostBySlugHandler);
router.put(
  "/posts/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  updatePostHandler
);
router.delete("/posts/:id", authMiddleware, adminMiddleware, deletePostHandler);

// Category Routes
router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  createCategoryHandler
);
router.get("/categories", getCategoriesHandler);
router.get("/categories/:id", getCategoriesByIdHandler);
router.get("/categories/slug/:slug", getCategoryBySlugHandler);
router.put(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  updateCategoryHandler
);
router.delete(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategoryHandler
);

// Tour Package Routes
router.post(
  "/tour-packages",
  authMiddleware,
  adminMiddleware,
  createTourPackageHandler
);
router.get("/tour-packages", getTourPackagesHandler);
router.get("/tour-packages/:id", getTourPackageByIdHandler);
router.get("/tour-packages/slug/:slug", getTourPackageBySlugHandler);
router.put(
  "/tour-packages/:id",
  authMiddleware,
  adminMiddleware,
  updateTourPackageHandler
);
router.delete(
  "/tour-packages/:id",
  authMiddleware,
  adminMiddleware,
  deleteTourPackageHandler
);

// Tour Image Routes
router.post(
  "/tour-packages/:packageId/images",
  uploadPackageImage.single("image"),
  authMiddleware,
  adminMiddleware,
  createTourImageHandler
);
router.get("/tour-packages/:packageId/images", getTourImagesByPackageHandler);
router.get("/tour-packages/:packageId/images/:id", getTourImageByIdHandler);
router.put(
  "/tour-packages/:packageId/images/:id",
  uploadPackageImage.single("image"),
  authMiddleware,
  adminMiddleware,
  updateTourImageHandler
);
router.delete(
  "/tour-packages/:packageId/images/:id",
  authMiddleware,
  adminMiddleware,
  deleteTourImageHandler
);

export default router;

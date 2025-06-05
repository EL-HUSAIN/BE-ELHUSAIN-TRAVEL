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
import { get } from "http";
import { create } from "domain";
import {
  createTourPackageHandler,
  deleteTourPackageHandler,
  getTourPackageByIdHandler,
  getTourPackageBySlugHandler,
  getTourPackagesHandler,
  updateTourPackageHandler,
} from "../handler/tourPackage.handler";
import { uploadPackageImage } from "../middleware/uploadPackages.middleware";
import { createTourImageHandler, deleteTourImageHandler, getTourImageByIdHandler, getTourImagesByPackageHandler, updateTourImageHandler } from "../handler/tourImage.handler";

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
router.put("/posts/:id", authMiddleware, adminMiddleware, updatePostHandler);
router.delete("/posts/:id", authMiddleware, adminMiddleware, deletePostHandler);

// Category Routes
router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  createCategoryHandler
);
router.get(
  "/categories",
  authMiddleware,
  adminMiddleware,
  getCategoriesHandler
);
router.get(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  getCategoriesByIdHandler
);
router.get(
  "/categories/:slug",
  authMiddleware,
  adminMiddleware,
  getCategoryBySlugHandler
);
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
router.get(
  "/tour-packages",
  authMiddleware,
  adminMiddleware,
  getTourPackagesHandler
);
router.get(
  "/tour-packages/:id",
  authMiddleware,
  adminMiddleware,
  getTourPackageByIdHandler
);
router.get(
  "/tour-packages/slug/:slug",
  authMiddleware,
  adminMiddleware,
  getTourPackageBySlugHandler
);
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
  "/api/packages/:packageId/images",
  uploadPackageImage.single("image"),
  createTourImageHandler
);
router.get("/api/packages/:packageId/images", getTourImagesByPackageHandler);
router.get("/api/packages/:packageId/images/:id", getTourImageByIdHandler);
router.put(
  "/api/packages/:packageId/images/:id",
  uploadPackageImage.single("image"),
  updateTourImageHandler
);
router.delete("/api/packages/:packageId/images/:id", deleteTourImageHandler);

export default router;

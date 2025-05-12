import { Router } from "express";
import { applyVisaHandler, checkStatusHandler } from "../handler/visa.handler";

const router = Router();

router.get("/", (req, res) => {
  res.send("Selamat Datang di API Visa Elhusein");
});

// POST /api/visa/apply
router.post("/apply", applyVisaHandler);

// GET /api/visa/status/:id
router.get("/status/:id", checkStatusHandler);

export default router;

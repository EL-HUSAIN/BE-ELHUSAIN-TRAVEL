"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visa_handler_1 = require("../handler/visa.handler");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("Selamat Datang di API Visa Elhusein");
});
// POST /api/visa/apply
router.post("/visa/apply", visa_handler_1.applyVisaHandler);
// GET /api/visa/status/:id
router.get("/visa/status/:id", visa_handler_1.checkStatusHandler);
exports.default = router;

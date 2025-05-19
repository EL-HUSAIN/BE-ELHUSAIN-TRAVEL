// src/handler/admin/admin.handler.ts
import { Request, Response, NextFunction } from "express";
import { loginAdmin, registerAdmin } from "../service/admin.service";

// Handler for admin Registration
export async function registerAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, role } = req.body;
    const result = await registerAdmin(email, password, role);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function adminLoginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const result = await loginAdmin(email, password);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

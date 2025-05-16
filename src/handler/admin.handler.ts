// src/handler/admin/admin.handler.ts
import { Request, Response, NextFunction } from "express";
import { loginAdmin } from "../service/admin.service";

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

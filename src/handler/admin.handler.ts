// src/handler/admin/admin.handler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  deleteAdmin,
  getAdminById,
  getAdmins,
  loginAdmin,
  registerAdmin,
  updateAdmin,
} from "../service/admin.service";
import { UpdateAdminDTO } from "../dto/admin.dto";

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

// Handler for getting admin by ID
export async function getAdminByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const admin = await getAdminById(id);
    res.json({ success: true, admin });
  } catch (err) {
    next(err);
  }
}

// Handler for getting all admins
export async function getAdminsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const admins = await getAdmins();
    res.json({ success: true, admins });
  } catch (err) {
    next(err);
  }
}

// Handler for updating admin
export const updateAdminHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const dto = req.body as UpdateAdminDTO;
    const updated = await updateAdmin(id, dto);
    res.json({ success: true, admin: updated });
  } catch (err) {
    next(err);
  }
};

// Handler for deleting admin
export async function deleteAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    await deleteAdmin(id);
    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (err) {
    next(err);
  }
}

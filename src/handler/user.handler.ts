import { Request, Response, NextFunction } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../service/user.service";
import {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
} from "../dto/auth_user.dto";

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = req.body as RegisterDTO;
    const user = await register(dto);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = req.body as LoginDTO;
    const result = await login(dto);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function forgotPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = req.body as ForgotPasswordDTO;
    const info = await forgotPassword(dto);
    res.json({ success: true, ...info });
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = req.body as ResetPasswordDTO;
    const info = await resetPassword(dto);
    res.json({ success: true, ...info });
  } catch (err) {
    next(err);
  }
}

export async function changePasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // authMiddleware harus set req.user.id
    const dto: ChangePasswordDTO = {
      userId: (req as any).user.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    };
    const info = await changePassword(dto);
    res.json({ success: true, ...info });
  } catch (err) {
    next(err);
  }
}

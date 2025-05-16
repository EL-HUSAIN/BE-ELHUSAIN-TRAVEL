import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAdminByEmail } from "../repository/admin.repository";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ token: string; adminId: number; email: string; role: string }> {
  const admin = await findAdminByEmail(email);
  if (!admin) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { sub: admin.id, email: admin.email, type: "ADMIN", role: admin.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { token, adminId: admin.id, email: admin.email, role: admin.role };
}

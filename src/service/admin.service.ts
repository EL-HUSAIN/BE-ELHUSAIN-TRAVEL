import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createAdmin,
  findAdminByEmail,
  repoDeleteAdmin,
  repoGetAdminById,
  repoGetAdmins,
  repoUpdateAdmin,
} from "../repository/admin.repository";
import { Admin, AdminRole } from "@prisma/client";
import { UpdateAdminDTO } from "../dto/admin.dto";

const JWT_SECRET = process.env.JWT_SECRET!;

// register admin
export async function registerAdmin(
  email: string,
  password: string,
  role: "NORMAL" | "SUPER"
): Promise<{ token: string; adminId: number; email: string; role: string }> {
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await createAdmin(email, passwordHash, role);

  const token = jwt.sign(
    { sub: admin.id, email: admin.email, type: "ADMIN", role: admin.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { token, adminId: admin.id, email: admin.email, role: admin.role };
}

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

export async function getAdminById(id: number): Promise<Admin | null> {
  const admin = await repoGetAdminById(id);
  if (!admin) throw new Error("Admin not found");
  return admin;
}

export async function getAdmins(): Promise<Admin[]> {
  return await repoGetAdmins();
}

export async function updateAdmin(
  id: number,
  dto: UpdateAdminDTO
): Promise<Admin> {
  // 1) Ensure admin exists
  const existing = await repoGetAdminById(id);
  if (!existing) throw new Error("Admin not found");

  // 2) Build the “data” object for Prisma
  const data: Partial<{
    email: string;
    passwordHash: string;
    role: AdminRole;
  }> = {};

  if (dto.email) {
    data.email = dto.email;
  }
  if (dto.role) {
    data.role = dto.role;
  }
  if (dto.password) {
    // hash the new password
    data.passwordHash = await bcrypt.hash(dto.password, 10);
  }

  // 3) Call repository with the correct fields
  return repoUpdateAdmin(id, data);
}

export async function deleteAdmin(id: number): Promise<Admin> {
  const admin = await repoGetAdminById(id);
  if (!admin) throw new Error("Admin not found");

  return await repoDeleteAdmin(id);
}

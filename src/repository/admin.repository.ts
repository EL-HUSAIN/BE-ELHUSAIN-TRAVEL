import prisma from "../../prisma/client";
import { Admin, AdminRole } from "@prisma/client";

// Create a new admin
export async function createAdmin(
  email: string,
  passwordHash: string,
  role: "NORMAL" | "SUPER"
): Promise<Admin> {
  return prisma.admin.create({
    data: {
      email,
      passwordHash,
      role,
    },
  });
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
  return prisma.admin.findUnique({ where: { email } });
}

export async function repoGetAdminById(id: number): Promise<Admin | null> {
  return prisma.admin.findUnique({ where: { id } });
}

export async function repoGetAdmins(): Promise<Admin[]> {
  return prisma.admin.findMany();
}

// src/repository/admin/admin.repository.ts

export async function repoUpdateAdmin(
  id: number,
  data: Partial<{ email: string; passwordHash: string; role: AdminRole }>
): Promise<Admin> {
  return prisma.admin.update({
    where: { id },
    data,
  });
}

export async function repoDeleteAdmin(id: number): Promise<Admin> {
  return prisma.admin.delete({
    where: { id },
  });
}

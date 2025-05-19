import { AdminRole } from "@prisma/client";

export interface AdminLoginDTO {
  email: string;
  password: string;
}

export interface UpdateAdminDTO {
  email?: string;
  password?: string; // plain‐text
  role?: AdminRole;
}

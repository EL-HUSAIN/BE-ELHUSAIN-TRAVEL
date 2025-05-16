export interface RegisterDTO {
  email: string;
  password: string;
  accountType: "PERSONAL" | "ORGANIZATION";
  firstName: string;
  lastName: string;
  countryCode: string;
  nationality: string;
  phoneNumber?: string;
  organizationName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  userId: number; // biasanya diambil dari token JWT
  currentPassword: string;
  newPassword: string;
}

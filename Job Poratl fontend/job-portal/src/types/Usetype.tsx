// Account Type
export type AccountType = "APPLICANT" | "EMPLOYER" | "ADMIN";

export const AccountTypes = {
  APPLICANT: "APPLICANT",
  EMPLOYER: "EMPLOYER",
  ADMIN: "ADMIN",
} as const;

// Interfaces
export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  accountType: AccountType;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  jwt(jwt: any): { payload: any; type: "jwt/setJwt"; };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  id: number;
  name: string;
  email: string;
  accountType: AccountType;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  timestamp: string;
}
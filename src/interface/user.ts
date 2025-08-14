export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  authProvider: string;
  isEmailVerified: boolean;
  lastLoginAt: string;
}

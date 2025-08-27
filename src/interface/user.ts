export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  authProvider: string;
  isEmailVerified: boolean;
  lastLoginAt: string;
}

export interface UserSetting {
  mainInstrument: number;
  genres: number[];
  experience: number;
  purpose: number;
  customGoal: string;
}

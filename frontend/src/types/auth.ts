export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}

export interface SignupFormData {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupData {
  nickname: string;
  email: string;
  password: string;
}
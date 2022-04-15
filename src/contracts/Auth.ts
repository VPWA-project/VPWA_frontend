export interface ApiToken {
  type: 'bearer';
  token: string;
  expires_at?: string;
  expires_in?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  firstname: string;
  lastname: string;
  nickname: string;
}

export interface RegisterResponse {
  user: User;
  token: ApiToken;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationError {
  rule: string;
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  errors: ValidationError[];
}
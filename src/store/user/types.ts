export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserRegisterPayload {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  nickname: string;
}

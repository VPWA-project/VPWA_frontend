import type { AxiosError, AxiosRequestConfig } from 'axios';
import {
  ApiToken,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  User,
} from 'src/contracts';
import { api } from 'src/boot/axios';

class AuthService {
  async me(dontTriggerLogout = false): Promise<User | null> {
    return api
      .get('auth/me', { dontTriggerLogout } as AxiosRequestConfig)
      .then((response) => response.data as User | null)
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          return null;
        }

        return Promise.reject(error);
      });
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('auth/register', data);
    return response.data;
  }

  async login(credentials: LoginRequest): Promise<ApiToken> {
    const response = await api.post<ApiToken>('auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('auth/logout');
  }

  async update(data: UpdateUserRequest): Promise<User> {
    const response = await api.put<UpdateUserResponse>('auth/me', data);
    return response.data;
  }
}

export default new AuthService();

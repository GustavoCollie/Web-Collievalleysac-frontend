import api from "./api";
import type { AuthTokens, LoginRequest, RegisterRequest, User } from "../types/user";

export const authService = {
  async login(data: LoginRequest): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<User> {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};

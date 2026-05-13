import api from "./api";
import type { User, Role } from "../types/user";

interface UserListResponse {
  users: User[];
  total: number;
}

export interface Metrics {
  total_users: number;
  active_users: number;
  total_orders: number;
  total_brokerage_requests: number;
  total_advisory_requests: number;
  users_by_role: Record<string, number>;
}

interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: Role;
}

interface UpdateUserData {
  full_name?: string;
  phone?: string;
  role?: Role;
  is_active?: boolean;
}

export const adminService = {
  async getUsers(): Promise<User[]> {
    const { data } = await api.get<UserListResponse>("/admin/users");
    return data.users;
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const { data } = await api.post<User>("/admin/users", userData);
    return data;
  },

  async updateUser(userId: string, updates: UpdateUserData): Promise<User> {
    const { data } = await api.put<User>(`/admin/users/${userId}`, updates);
    return data;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },

  async getMetrics(): Promise<Metrics> {
    const { data } = await api.get<Metrics>("/admin/metrics");
    return data;
  },
};

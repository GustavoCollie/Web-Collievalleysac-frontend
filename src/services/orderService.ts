import api from "./api";
import type { Order, CreateOrderRequest } from "../types/order";

interface OrderListResponse {
  orders: Order[];
  total: number;
}

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<Order>("/orders", data);
    return response.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const { data } = await api.get<OrderListResponse>("/orders");
    return data.orders;
  },

  async getOrder(orderId: string): Promise<Order> {
    const { data } = await api.get<Order>(`/orders/${orderId}`);
    return data;
  },

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const { data } = await api.patch<Order>(`/orders/${orderId}/status`, {
      status,
    });
    return data;
  },
};

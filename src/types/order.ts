export type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  product_id: string;
  quantity_kg: number;
  quality_grade: string;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  delivery_date: string | null;
  shipping_address: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
}

export interface CreateOrderRequest {
  items: {
    product_id: string;
    quantity_kg: number;
    quality_grade: string;
  }[];
  delivery_date?: string;
  shipping_address?: string;
  notes?: string;
}

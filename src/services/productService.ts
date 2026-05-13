import api from "./api";
import type { Product } from "../types/product";

interface ProductListResponse {
  products: Product[];
  total: number;
}

export const productService = {
  async getProducts(month?: number): Promise<Product[]> {
    const params = month ? { month } : {};
    const { data } = await api.get<ProductListResponse>("/products", { params });
    return data.products;
  },
};

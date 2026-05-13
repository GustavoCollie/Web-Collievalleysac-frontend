import api from "./api";

export interface BrokerageRequest {
  id: string;
  user_id: string;
  origin_country: string;
  dest_country: string;
  product_type: string;
  volume_kg: number;
  certifications: string[];
  status: string;
  quoted_price: number | null;
  notes: string;
  created_at: string;
}

interface BrokerageListResponse {
  requests: BrokerageRequest[];
  total: number;
}

interface CreateBrokerageData {
  origin_country: string;
  dest_country: string;
  product_type: string;
  volume_kg: number;
  certifications?: string[];
  notes?: string;
}

export const brokerageService = {
  async create(data: CreateBrokerageData): Promise<BrokerageRequest> {
    const response = await api.post<BrokerageRequest>("/brokerage", data);
    return response.data;
  },

  async getMyRequests(): Promise<BrokerageRequest[]> {
    const { data } = await api.get<BrokerageListResponse>("/brokerage");
    return data.requests;
  },
};

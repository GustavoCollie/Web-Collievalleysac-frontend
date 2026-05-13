import api from "./api";

export interface CropYield {
  current: number;
  previous: number;
  unit: string;
  trend: string;
}

export interface ExportForecast {
  next_month_tons: number;
  next_quarter_tons: number;
  confidence: number;
}

export interface Alert {
  type: string;
  message: string;
  severity: string;
}

export interface CollieMetrics {
  status: string;
  crop_yield: CropYield | null;
  export_forecast: ExportForecast | null;
  alerts: Alert[];
  quality_score: number | null;
}

export interface SSORedirect {
  redirect_url: string;
  token: string;
}

export const collieAppService = {
  async getMetrics(): Promise<CollieMetrics> {
    const { data } = await api.get<CollieMetrics>("/collie-app/metrics");
    return data;
  },

  async getSSORedirect(): Promise<SSORedirect> {
    const { data } = await api.get<SSORedirect>("/collie-app/redirect");
    return data;
  },

  async syncData(): Promise<{ status: string; synced: boolean }> {
    const { data } = await api.post<{ status: string; synced: boolean }>("/collie-app/sync");
    return data;
  },
};

import api from "./api";

export interface Advisory {
  id: string;
  user_id: string;
  crop_type: string;
  problem_description: string;
  preferred_date: string | null;
  urgency: string;
  status: string;
  advisor_notes: string;
  created_at: string;
}

export interface TechnicalArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  crop_tags: string[];
  author: string;
  published_at: string | null;
  created_at: string;
}

interface AdvisoryListResponse {
  advisories: Advisory[];
  total: number;
}

interface ArticleListResponse {
  articles: TechnicalArticle[];
  total: number;
}

interface CreateAdvisoryData {
  crop_type: string;
  problem_description: string;
  preferred_date?: string;
  urgency?: string;
}

export const advisoryService = {
  async create(data: CreateAdvisoryData): Promise<Advisory> {
    const response = await api.post<Advisory>("/advisories", data);
    return response.data;
  },

  async getMyAdvisories(): Promise<Advisory[]> {
    const { data } = await api.get<AdvisoryListResponse>("/advisories");
    return data.advisories;
  },

  async getArticles(cropTags?: string[]): Promise<TechnicalArticle[]> {
    const params = cropTags ? { crop_tags: cropTags.join(",") } : {};
    const { data } = await api.get<ArticleListResponse>("/articles", { params });
    return data.articles;
  },

  async getArticle(slug: string): Promise<TechnicalArticle> {
    const { data } = await api.get<TechnicalArticle>(`/articles/${slug}`);
    return data;
  },
};

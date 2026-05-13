import api from "./api";

export interface LandingSection {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  content: Record<string, unknown>;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

interface SectionsResponse {
  sections: LandingSection[];
}

export const landingService = {
  async getPublicSections(): Promise<LandingSection[]> {
    const { data } = await api.get<SectionsResponse>("/landing/sections");
    return data.sections;
  },

  async getAllSections(): Promise<LandingSection[]> {
    const { data } = await api.get<SectionsResponse>(
      "/admin/landing/sections",
    );
    return data.sections;
  },

  async createSection(
    section: Omit<LandingSection, "id" | "created_at">,
  ): Promise<LandingSection> {
    const { data } = await api.post<LandingSection>(
      "/admin/landing/sections",
      section,
    );
    return data;
  },

  async updateSection(
    sectionKey: string,
    updates: Partial<LandingSection>,
  ): Promise<LandingSection> {
    const { data } = await api.put<LandingSection>(
      `/admin/landing/sections/${sectionKey}`,
      updates,
    );
    return data;
  },

  async deleteSection(sectionKey: string): Promise<void> {
    await api.delete(`/admin/landing/sections/${sectionKey}`);
  },
};

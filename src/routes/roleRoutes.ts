import type { Role } from "../types/user";

export const DASHBOARD_ROUTES: Record<Role, string> = {
  admin: "/admin",
  importador: "/importer",
  exportador_broker: "/broker",
  agricultor: "/farmer",
  exportador_collie: "/collie-app",
};

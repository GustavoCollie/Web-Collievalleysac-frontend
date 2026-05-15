import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

interface NavLink {
  label: string;
  path: string;
}

const NAV_LINKS: Record<string, NavLink[]> = {
  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Usuarios", path: "/admin/users" },
    { label: "Landing Editor", path: "/admin/landing" },
  ],
  importador: [
    { label: "Dashboard", path: "/importer" },
    { label: "Catálogo", path: "/importer/catalog" },
    { label: "Nuevo Pedido", path: "/importer/orders/new" },
    { label: "Mis Pedidos", path: "/importer/orders" },
  ],
  exportador_broker: [
    { label: "Dashboard", path: "/broker" },
    { label: "Nueva Solicitud", path: "/broker/request" },
    { label: "Indicadores", path: "/broker/market" },
  ],
  agricultor: [
    { label: "Dashboard", path: "/farmer" },
    { label: "Solicitar Asesoría", path: "/farmer/advisory" },
    { label: "Artículos", path: "/farmer/articles" },
    { label: "Calendario", path: "/farmer/calendar" },
  ],
  exportador_collie: [
    { label: "Dashboard", path: "/collie-app" },
    { label: "Ir a Collie App", path: "/collie-app/redirect" },
  ],
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = user ? NAV_LINKS[user.role] || [] : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="h-6 w-6 rounded-full bg-collie-600" />
          <span className="font-bold text-collie-800">Collie Valley</span>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-collie-50 hover:text-collie-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-3">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <button
            className="text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.full_name}
            </span>
            <div className="h-8 w-8 rounded-full bg-collie-200 flex items-center justify-center text-sm font-medium text-collie-700">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

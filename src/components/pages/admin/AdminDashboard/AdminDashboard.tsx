import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService, type Metrics } from "../../../../services/adminService";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";
import { Spinner } from "../../../atoms/Spinner/Spinner";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admins",
  importador: "Importadores",
  exportador_broker: "Brokers",
  agricultor: "Agricultores",
  exportador_collie: "Collie App",
};

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getMetrics()
      .then(setMetrics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <H1>Panel de Administración</H1>
      <Paragraph className="mt-2">
        Gestiona usuarios, contenido de la landing page y métricas del sistema.
      </Paragraph>

      {/* Quick actions */}
      <div className="mt-6 flex gap-4">
        <Link
          to="/admin/users"
          className="rounded-lg bg-collie-600 px-4 py-2 text-sm font-medium text-white hover:bg-collie-700"
        >
          Gestionar Usuarios
        </Link>
        <Link
          to="/admin/landing"
          className="rounded-lg border border-collie-600 px-4 py-2 text-sm font-medium text-collie-600 hover:bg-collie-50"
        >
          Editar Landing Page
        </Link>
      </div>

      {/* Metrics cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <p className="text-sm text-gray-500">Usuarios activos</p>
          <p className="mt-2 text-3xl font-bold text-collie-700">
            {metrics?.active_users ?? "—"}{" "}
            <span className="text-base font-normal text-gray-400">
              / {metrics?.total_users ?? 0}
            </span>
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <p className="text-sm text-gray-500">Pedidos totales</p>
          <p className="mt-2 text-3xl font-bold text-collie-700">
            {metrics?.total_orders ?? "—"}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <p className="text-sm text-gray-500">Solicitudes de brokeraje</p>
          <p className="mt-2 text-3xl font-bold text-collie-700">
            {metrics?.total_brokerage_requests ?? "—"}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <p className="text-sm text-gray-500">Asesorías solicitadas</p>
          <p className="mt-2 text-3xl font-bold text-collie-700">
            {metrics?.total_advisory_requests ?? "—"}
          </p>
        </div>
      </div>

      {/* Users by role */}
      {metrics?.users_by_role && Object.keys(metrics.users_by_role).length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Usuarios por rol</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {Object.entries(metrics.users_by_role).map(([role, count]) => (
              <div key={role} className="rounded-lg bg-white p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-collie-600">{count}</p>
                <p className="text-xs text-gray-500">{ROLE_LABELS[role] || role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

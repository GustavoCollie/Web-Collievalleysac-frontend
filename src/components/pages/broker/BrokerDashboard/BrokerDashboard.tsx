import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { brokerageService, type BrokerageRequest } from "../../../../services/brokerageService";
import { DataTable } from "../../../organisms/DataTable/DataTable";
import { StatCard } from "../../../molecules/StatCard/StatCard";
import { Badge } from "../../../atoms/Badge/Badge";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }
> = {
  requested: { label: "Solicitado", variant: "warning" },
  quoted: { label: "Cotizado", variant: "info" },
  in_progress: { label: "En progreso", variant: "info" },
  completed: { label: "Completado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

export function BrokerDashboard() {
  const [requests, setRequests] = useState<BrokerageRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    brokerageService
      .getMyRequests()
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = requests.filter((r) => ["requested", "quoted", "in_progress"].includes(r.status)).length;
  const quoted = requests.filter((r) => r.status === "quoted").length;
  const completed = requests.filter((r) => r.status === "completed").length;

  const columns = [
    {
      key: "route",
      header: "Ruta",
      render: (r: BrokerageRequest) => (
        <span className="font-medium">{r.origin_country} → {r.dest_country}</span>
      ),
    },
    {
      key: "product_type",
      header: "Producto",
      render: (r: BrokerageRequest) => <span>{r.product_type}</span>,
    },
    {
      key: "volume_kg",
      header: "Volumen",
      render: (r: BrokerageRequest) => (
        <span>{r.volume_kg.toLocaleString()} kg</span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (r: BrokerageRequest) => {
        const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.requested;
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
      },
    },
    {
      key: "quoted_price",
      header: "Cotización",
      render: (r: BrokerageRequest) => (
        <span className="font-semibold">
          {r.quoted_price ? `$${r.quoted_price.toFixed(2)}` : "Pendiente"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Fecha",
      render: (r: BrokerageRequest) => (
        <span className="text-sm text-gray-500">
          {new Date(r.created_at).toLocaleDateString("es-PE")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <H1>Dashboard Broker</H1>
      <Paragraph className="mt-2">
        Gestiona tus solicitudes de brokeraje y consulta indicadores de mercado.
      </Paragraph>

      <div className="mt-6 flex gap-4">
        <Link
          to="/broker/request"
          className="rounded-lg bg-collie-600 px-4 py-2 text-sm font-medium text-white hover:bg-collie-700"
        >
          Nueva Solicitud
        </Link>
        <Link
          to="/broker/market"
          className="rounded-lg border border-collie-600 px-4 py-2 text-sm font-medium text-collie-600 hover:bg-collie-50"
        >
          Indicadores de Mercado
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Solicitudes activas" value={active} />
        <StatCard label="Cotizaciones recibidas" value={quoted} />
        <StatCard label="Operaciones completadas" value={completed} colorClass="text-green-600" />
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-medium">Mis solicitudes</h3>
        <DataTable
          columns={columns}
          data={requests}
          loading={loading}
          keyExtractor={(r) => r.id}
          emptyMessage="No tienes solicitudes de brokeraje. Crea una nueva."
        />
      </div>
    </div>
  );
}

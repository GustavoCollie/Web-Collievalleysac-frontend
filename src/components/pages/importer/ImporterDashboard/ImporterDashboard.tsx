import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../../../services/orderService";
import { StatCard } from "../../../molecules/StatCard/StatCard";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";
import type { Order } from "../../../../types/order";

export function ImporterDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    orderService.getMyOrders().then(setOrders).catch(() => {});
  }, []);

  const active = orders.filter((o) => ["pending", "confirmed"].includes(o.status)).length;
  const shipped = orders.filter((o) => o.status === "shipped").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;

  return (
    <div>
      <H1>Dashboard Importador</H1>
      <Paragraph className="mt-2">
        Explora nuestro catálogo, realiza pedidos y da seguimiento a tus envíos.
      </Paragraph>

      <div className="mt-6 flex gap-4">
        <Link
          to="/importer/catalog"
          className="rounded-lg bg-collie-600 px-4 py-2 text-sm font-medium text-white hover:bg-collie-700"
        >
          Ver Catálogo
        </Link>
        <Link
          to="/importer/orders/new"
          className="rounded-lg border border-collie-600 px-4 py-2 text-sm font-medium text-collie-600 hover:bg-collie-50"
        >
          Nuevo Pedido
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total pedidos" value={orders.length} />
        <StatCard label="Pedidos activos" value={active} />
        <StatCard label="En tránsito" value={shipped} />
        <StatCard label="Entregados" value={delivered} colorClass="text-green-600" />
      </div>

      {orders.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Pedidos recientes</h3>
            <Link to="/importer/orders" className="text-sm text-collie-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                  <p className="text-xs text-gray-500">
                    {order.items.length} productos - {new Date(order.created_at).toLocaleDateString("es-PE")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                  <p className="text-xs capitalize text-gray-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { orderService } from "../../../../services/orderService";
import { DataTable } from "../../../organisms/DataTable/DataTable";
import { Badge } from "../../../atoms/Badge/Badge";
import { Button } from "../../../atoms/Button/Button";
import { H1 } from "../../../atoms/Typography/Typography";
import type { Order } from "../../../../types/order";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }
> = {
  draft: { label: "Borrador", variant: "neutral" },
  pending: { label: "Pendiente", variant: "warning" },
  confirmed: { label: "Confirmado", variant: "info" },
  shipped: { label: "Enviado", variant: "info" },
  delivered: { label: "Entregado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId: string) => {
    if (window.confirm("¿Cancelar este pedido?")) {
      await orderService.updateStatus(orderId, "cancelled");
      loadOrders();
    }
  };

  const handleConfirm = async (orderId: string) => {
    await orderService.updateStatus(orderId, "pending");
    loadOrders();
  };

  const columns = [
    {
      key: "id",
      header: "Pedido",
      render: (order: Order) => (
        <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: "items",
      header: "Productos",
      render: (order: Order) => (
        <span>{order.items.length} producto(s)</span>
      ),
    },
    {
      key: "total_amount",
      header: "Total",
      render: (order: Order) => (
        <span className="font-semibold">
          ${order.total_amount.toFixed(2)} {order.currency}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (order: Order) => {
        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.draft;
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
      },
    },
    {
      key: "delivery_date",
      header: "Entrega",
      render: (order: Order) => (
        <span className="text-sm text-gray-600">
          {order.delivery_date || "Sin fecha"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Creado",
      render: (order: Order) => (
        <span className="text-sm text-gray-500">
          {new Date(order.created_at).toLocaleDateString("es-PE")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (order: Order) => (
        <div className="flex gap-2">
          {order.status === "draft" && (
            <Button size="sm" variant="outline" onClick={() => handleConfirm(order.id)}>
              Enviar
            </Button>
          )}
          {["draft", "pending"].includes(order.status) && (
            <Button size="sm" variant="danger" onClick={() => handleCancel(order.id)}>
              Cancelar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <H1>Mis Pedidos</H1>
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          keyExtractor={(o) => o.id}
          emptyMessage="No tienes pedidos aún. Explora el catálogo para crear uno."
        />
      </div>
    </div>
  );
}

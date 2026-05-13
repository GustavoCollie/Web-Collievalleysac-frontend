import { useEffect, useState } from "react";
import { advisoryService, type Advisory } from "../../../../services/advisoryService";
import { Button } from "../../../atoms/Button/Button";
import { Input } from "../../../atoms/Input/Input";
import { Badge } from "../../../atoms/Badge/Badge";
import { DataTable } from "../../../organisms/DataTable/DataTable";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";

const URGENCY_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
  low: { label: "Baja", variant: "success" },
  medium: { label: "Media", variant: "warning" },
  high: { label: "Alta", variant: "danger" },
};

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "info" | "neutral" | "danger" }> = {
  requested: { label: "Solicitada", variant: "warning" },
  scheduled: { label: "Programada", variant: "info" },
  completed: { label: "Completada", variant: "success" },
  cancelled: { label: "Cancelada", variant: "danger" },
};

export function AdvisoryRequestPage() {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    crop_type: "",
    problem_description: "",
    preferred_date: "",
    urgency: "medium",
  });

  const loadAdvisories = () => {
    setLoading(true);
    advisoryService.getMyAdvisories().then(setAdvisories).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadAdvisories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await advisoryService.create({
        crop_type: form.crop_type,
        problem_description: form.problem_description,
        preferred_date: form.preferred_date || undefined,
        urgency: form.urgency,
      });
      setShowForm(false);
      setForm({ crop_type: "", problem_description: "", preferred_date: "", urgency: "medium" });
      loadAdvisories();
    } catch { /* handle */ }
    finally { setSubmitting(false); }
  };

  const columns = [
    { key: "crop_type", header: "Cultivo", render: (a: Advisory) => <span className="font-medium">{a.crop_type}</span> },
    { key: "problem_description", header: "Problema", render: (a: Advisory) => <span className="text-sm text-gray-600 line-clamp-1">{a.problem_description}</span> },
    { key: "urgency", header: "Urgencia", render: (a: Advisory) => { const c = URGENCY_CONFIG[a.urgency]; return <Badge variant={c?.variant || "neutral"}>{c?.label || a.urgency}</Badge>; } },
    { key: "status", header: "Estado", render: (a: Advisory) => { const c = STATUS_CONFIG[a.status]; return <Badge variant={c?.variant || "neutral"}>{c?.label || a.status}</Badge>; } },
    { key: "preferred_date", header: "Fecha preferida", render: (a: Advisory) => <span className="text-sm">{a.preferred_date || "Flexible"}</span> },
    { key: "created_at", header: "Creada", render: (a: Advisory) => <span className="text-sm text-gray-500">{new Date(a.created_at).toLocaleDateString("es-PE")}</span> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <H1>Asesorías Agronómicas</H1>
          <Paragraph className="mt-1">Solicita asesoría de nuestros expertos.</Paragraph>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nueva Asesoría"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl bg-white p-6 shadow-md space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Tipo de cultivo" value={form.crop_type} onChange={(e) => setForm(p => ({ ...p, crop_type: e.target.value }))} placeholder="Ej: Palta Hass" required />
            <Input label="Fecha preferida" type="date" value={form.preferred_date} onChange={(e) => setForm(p => ({ ...p, preferred_date: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Urgencia</label>
            <select value={form.urgency} onChange={(e) => setForm(p => ({ ...p, urgency: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:w-48">
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descripción del problema</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={4} value={form.problem_description} onChange={(e) => setForm(p => ({ ...p, problem_description: e.target.value }))} placeholder="Describe el problema que necesitas resolver..." required />
          </div>
          <Button type="submit" isLoading={submitting}>Enviar Solicitud</Button>
        </form>
      )}

      <div className="mt-6">
        <DataTable columns={columns} data={advisories} loading={loading} keyExtractor={(a) => a.id} emptyMessage="No tienes asesorías solicitadas." />
      </div>
    </div>
  );
}

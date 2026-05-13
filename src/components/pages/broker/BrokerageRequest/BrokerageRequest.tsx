import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { brokerageService } from "../../../../services/brokerageService";
import { Button } from "../../../atoms/Button/Button";
import { Input } from "../../../atoms/Input/Input";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";

const CERT_OPTIONS = [
  "GlobalGAP", "HACCP", "BRC", "IFS", "Orgánico", "Fair Trade", "Rainforest Alliance",
];

export function BrokerageRequestPage() {
  const [form, setForm] = useState({
    origin_country: "",
    dest_country: "",
    product_type: "",
    volume_kg: "",
    notes: "",
  });
  const [certs, setCerts] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleCert = (cert: string) => {
    setCerts((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await brokerageService.create({
        origin_country: form.origin_country,
        dest_country: form.dest_country,
        product_type: form.product_type,
        volume_kg: parseFloat(form.volume_kg),
        certifications: certs,
        notes: form.notes,
      });
      navigate("/broker");
    } catch {
      setError("Error al crear la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <H1>Nueva Solicitud de Broker</H1>
      <Paragraph className="mt-2">
        Ingresa los datos de la operación que necesitas gestionar.
      </Paragraph>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="País de origen"
            value={form.origin_country}
            onChange={(e) => setForm((p) => ({ ...p, origin_country: e.target.value }))}
            placeholder="Perú"
            required
          />
          <Input
            label="País de destino"
            value={form.dest_country}
            onChange={(e) => setForm((p) => ({ ...p, dest_country: e.target.value }))}
            placeholder="Estados Unidos"
            required
          />
          <Input
            label="Tipo de producto"
            value={form.product_type}
            onChange={(e) => setForm((p) => ({ ...p, product_type: e.target.value }))}
            placeholder="Palta Hass"
            required
          />
          <Input
            label="Volumen (Kg)"
            type="number"
            value={form.volume_kg}
            onChange={(e) => setForm((p) => ({ ...p, volume_kg: e.target.value }))}
            placeholder="5000"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Certificaciones requeridas
          </label>
          <div className="flex flex-wrap gap-2">
            {CERT_OPTIONS.map((cert) => (
              <button
                key={cert}
                type="button"
                onClick={() => toggleCert(cert)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  certs.includes(cert)
                    ? "bg-collie-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cert}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            rows={4}
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Detalles adicionales de la operación..."
          />
        </div>

        <Button type="submit" isLoading={submitting} className="w-full">
          Enviar Solicitud
        </Button>
      </form>
    </div>
  );
}

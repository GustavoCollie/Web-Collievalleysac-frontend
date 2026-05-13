import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { advisoryService, type Advisory } from "../../../../services/advisoryService";
import { StatCard } from "../../../molecules/StatCard/StatCard";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";

export function FarmerDashboard() {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);

  useEffect(() => {
    advisoryService.getMyAdvisories().then(setAdvisories).catch(() => {});
  }, []);

  const scheduled = advisories.filter((a) => a.status === "scheduled").length;
  const requested = advisories.filter((a) => a.status === "requested").length;
  const completed = advisories.filter((a) => a.status === "completed").length;

  return (
    <div>
      <H1>Dashboard Agricultor</H1>
      <Paragraph className="mt-2">
        Solicita asesorías agronómicas, consulta artículos técnicos y tu calendario de buenas prácticas.
      </Paragraph>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link to="/farmer/advisory" className="rounded-lg bg-collie-600 px-4 py-2 text-sm font-medium text-white hover:bg-collie-700">
          Solicitar Asesoría
        </Link>
        <Link to="/farmer/articles" className="rounded-lg border border-collie-600 px-4 py-2 text-sm font-medium text-collie-600 hover:bg-collie-50">
          Artículos Técnicos
        </Link>
        <Link to="/farmer/calendar" className="rounded-lg border border-earth-600 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50">
          Calendario
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Asesorías pendientes" value={requested} colorClass="text-yellow-600" />
        <StatCard label="Asesorías programadas" value={scheduled} colorClass="text-blue-600" />
        <StatCard label="Asesorías completadas" value={completed} colorClass="text-green-600" />
      </div>

      {advisories.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium">Últimas solicitudes</h3>
          <div className="mt-4 space-y-2">
            {advisories.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                <div>
                  <p className="font-medium">{a.crop_type}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{a.problem_description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs capitalize text-gray-500">{a.status}</p>
                  <p className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString("es-PE")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

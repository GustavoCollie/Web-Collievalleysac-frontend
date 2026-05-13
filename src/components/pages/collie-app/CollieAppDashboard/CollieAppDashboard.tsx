import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { collieAppService, type CollieMetrics } from "../../../../services/collieAppService";
import { StatCard } from "../../../molecules/StatCard/StatCard";
import { Badge } from "../../../atoms/Badge/Badge";
import { Button } from "../../../atoms/Button/Button";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";
import { Spinner } from "../../../atoms/Spinner/Spinner";

const SEVERITY_VARIANT: Record<string, "danger" | "warning" | "success" | "info"> = {
  high: "danger",
  medium: "warning",
  low: "info",
};

export function CollieAppDashboard() {
  const [metrics, setMetrics] = useState<CollieMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    collieAppService.getMetrics().then(setMetrics).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleGoToApp = async () => {
    setRedirecting(true);
    try {
      const { redirect_url } = await collieAppService.getSSORedirect();
      window.open(redirect_url, "_blank");
    } catch { /* handle */ }
    finally { setRedirecting(false); }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
  }

  const yieldData = metrics?.crop_yield
    ? [
        { name: "Anterior", value: metrics.crop_yield.previous },
        { name: "Actual", value: metrics.crop_yield.current },
      ]
    : [];

  const forecastData = metrics?.export_forecast
    ? [
        { name: "Próx. mes", tons: metrics.export_forecast.next_month_tons },
        { name: "Próx. trimestre", tons: metrics.export_forecast.next_quarter_tons },
      ]
    : [];

  const qualityData = metrics?.quality_score
    ? [
        { name: "Score", value: metrics.quality_score },
        { name: "Restante", value: 100 - metrics.quality_score },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <H1>Dashboard Collie App</H1>
          <Paragraph className="mt-2">Métricas de IA, forecast y acceso directo a Collie App.</Paragraph>
        </div>
        <Button onClick={handleGoToApp} isLoading={redirecting}>
          Abrir Collie App
        </Button>
      </div>

      {metrics?.status === "unavailable" && (
        <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
          Collie App no está disponible. Mostrando datos de la última sincronización.
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Rendimiento actual"
          value={metrics?.crop_yield ? `${metrics.crop_yield.current} ${metrics.crop_yield.unit}` : "—"}
          sublabel={metrics?.crop_yield?.trend || ""}
        />
        <StatCard
          label="Forecast próx. mes"
          value={metrics?.export_forecast ? `${metrics.export_forecast.next_month_tons} ton` : "—"}
          sublabel={metrics?.export_forecast ? `Confianza: ${(metrics.export_forecast.confidence * 100).toFixed(0)}%` : ""}
        />
        <StatCard
          label="Quality Score"
          value={metrics?.quality_score ? `${metrics.quality_score}/100` : "—"}
          colorClass={metrics?.quality_score && metrics.quality_score >= 90 ? "text-green-600" : "text-yellow-600"}
        />
        <StatCard
          label="Alertas activas"
          value={metrics?.alerts.length ?? 0}
          colorClass={metrics?.alerts.length ? "text-red-600" : "text-green-600"}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {yieldData.length > 0 && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-medium">Rendimiento de Cultivos</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {forecastData.length > 0 && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-medium">Forecast de Exportación</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tons" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {qualityData.length > 0 && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-medium">Quality Score</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={qualityData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {qualityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#22c55e" : "#e5e7eb"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-3xl font-bold text-collie-700">{metrics?.quality_score}%</p>
          </div>
        )}

        {metrics?.alerts && metrics.alerts.length > 0 && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-medium">Alertas</h3>
            <div className="space-y-3">
              {metrics.alerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                  <Badge variant={SEVERITY_VARIANT[alert.severity] || "info"}>{alert.type}</Badge>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

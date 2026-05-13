import { H1, Paragraph } from "../../../atoms/Typography/Typography";
import { Badge } from "../../../atoms/Badge/Badge";

interface CalendarActivity {
  month: string;
  activities: { crop: string; task: string; priority: "high" | "medium" | "low" }[];
}

const CALENDAR_DATA: CalendarActivity[] = [
  {
    month: "Enero",
    activities: [
      { crop: "Palta", task: "Control fitosanitario post-cuajado", priority: "high" },
      { crop: "Arándano", task: "Poda de formación en plantas nuevas", priority: "medium" },
      { crop: "Espárrago", task: "Cosecha de turiones verdes", priority: "high" },
    ],
  },
  {
    month: "Febrero",
    activities: [
      { crop: "Mandarina", task: "Aplicar fertilización foliar con micronutrientes", priority: "high" },
      { crop: "Palta", task: "Monitoreo de trips y arañita roja", priority: "medium" },
      { crop: "Uva", task: "Manejo de canopia y despunte", priority: "medium" },
    ],
  },
  {
    month: "Marzo",
    activities: [
      { crop: "Palta", task: "Inicio de cosecha temprana (calibres grandes)", priority: "high" },
      { crop: "Paprika", task: "Preparación de suelo y trasplante", priority: "high" },
      { crop: "Arándano", task: "Fertilización de fondo con potasio", priority: "medium" },
    ],
  },
  {
    month: "Abril",
    activities: [
      { crop: "Mandarina", task: "Inicio de cosecha W. Murcott", priority: "high" },
      { crop: "Espárrago", task: "Periodo de agoste — suspender riego gradualmente", priority: "high" },
      { crop: "Palta", task: "Cosecha principal: calibración y selección", priority: "high" },
    ],
  },
  {
    month: "Mayo",
    activities: [
      { crop: "Palta", task: "Cosecha media estación, empaque para exportación", priority: "high" },
      { crop: "Mandarina", task: "Cosecha intensiva y tratamiento post-cosecha", priority: "high" },
      { crop: "Arándano", task: "Preparación para floración: poda sanitaria", priority: "medium" },
    ],
  },
  {
    month: "Junio",
    activities: [
      { crop: "General", task: "Análisis de suelo y plan de fertilización anual", priority: "medium" },
      { crop: "Uva", task: "Poda invernal de producción", priority: "high" },
      { crop: "Paprika", task: "Cosecha y secado natural de frutos", priority: "high" },
    ],
  },
];

const PRIORITY_VARIANT: Record<string, "danger" | "warning" | "success"> = {
  high: "danger",
  medium: "warning",
  low: "success",
};

export function CropCalendar() {
  const currentMonth = new Date().getMonth(); // 0-based

  return (
    <div>
      <H1>Calendario de Buenas Prácticas</H1>
      <Paragraph className="mt-2">
        Actividades recomendadas por mes para principales cultivos de exportación.
      </Paragraph>

      <div className="mt-8 space-y-6">
        {CALENDAR_DATA.map((entry, idx) => (
          <div
            key={entry.month}
            className={`rounded-xl bg-white p-6 shadow-md ${
              idx === currentMonth ? "ring-2 ring-collie-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">{entry.month}</h3>
              {idx === currentMonth && (
                <Badge variant="info">Mes actual</Badge>
              )}
            </div>
            <div className="mt-4 space-y-3">
              {entry.activities.map((act, actIdx) => (
                <div
                  key={actIdx}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div>
                    <span className="text-sm font-medium text-collie-700">{act.crop}</span>
                    <p className="text-sm text-gray-600">{act.task}</p>
                  </div>
                  <Badge variant={PRIORITY_VARIANT[act.priority]}>
                    {act.priority === "high" ? "Prioritario" : act.priority === "medium" ? "Normal" : "Bajo"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

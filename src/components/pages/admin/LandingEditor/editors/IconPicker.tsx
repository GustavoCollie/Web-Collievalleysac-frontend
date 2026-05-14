import { useState } from "react";

export interface IconDefinition {
  name: string;
  label: string;
  path: string;
}

export const AVAILABLE_ICONS: IconDefinition[] = [
  {
    name: "trending-up",
    label: "Tendencia",
    path: "M22 7l-8.5 8.5-5-5L2 17",
  },
  {
    name: "users",
    label: "Usuarios",
    path: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2m22-4v2a4 4 0 01-3 3.87M13 7a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 110 0",
  },
  {
    name: "package",
    label: "Paquete",
    path: "M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  },
  {
    name: "globe",
    label: "Global",
    path: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 0a14.5 14.5 0 014 10 14.5 14.5 0 01-4 10m0-20a14.5 14.5 0 00-4 10 14.5 14.5 0 004 10M2 12h20",
  },
  {
    name: "bar-chart",
    label: "Gráfico",
    path: "M12 20V10M18 20V4M6 20v-4",
  },
  {
    name: "leaf",
    label: "Hoja",
    path: "M11 20A7 7 0 019.8 6.9C15.5 4.9 20 2 20 2s-2.9 4.5-4.9 10.1A7 7 0 0111 20zm0 0c0 0-3-2-3-7",
  },
  {
    name: "truck",
    label: "Transporte",
    path: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 18.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 18.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  },
  {
    name: "award",
    label: "Premio",
    path: "M12 15a7 7 0 100-14 7 7 0 000 14zm0 0v7m-4 0h8",
  },
  {
    name: "shield",
    label: "Escudo",
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    name: "star",
    label: "Estrella",
    path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  {
    name: "zap",
    label: "Rayo",
    path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    name: "heart",
    label: "Corazón",
    path: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  },
  {
    name: "check-circle",
    label: "Verificado",
    path: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
  },
  {
    name: "clock",
    label: "Reloj",
    path: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2",
  },
  {
    name: "dollar-sign",
    label: "Dinero",
    path: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  },
  {
    name: "map-pin",
    label: "Ubicación",
    path: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z",
  },
];

export function renderIcon(iconName: string, className = "h-6 w-6") {
  const icon = AVAILABLE_ICONS.find((i) => i.name === iconName);
  if (!icon) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={icon.path} />
    </svg>
  );
}

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:border-collie-500"
      >
        {value ? (
          <>
            {renderIcon(value, "h-5 w-5 text-collie-600")}
            <span className="text-gray-700">
              {AVAILABLE_ICONS.find((i) => i.name === value)?.label || value}
            </span>
          </>
        ) : (
          <span className="text-gray-400">Seleccionar icono...</span>
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 grid grid-cols-4 gap-1 rounded-lg border bg-white p-3 shadow-lg">
          {AVAILABLE_ICONS.map((icon) => (
            <button
              key={icon.name}
              type="button"
              onClick={() => {
                onChange(icon.name);
                setOpen(false);
              }}
              className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-colors ${
                value === icon.name
                  ? "bg-collie-100 text-collie-700"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              title={icon.label}
            >
              {renderIcon(icon.name, "h-5 w-5")}
              <span className="truncate w-full text-center">{icon.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

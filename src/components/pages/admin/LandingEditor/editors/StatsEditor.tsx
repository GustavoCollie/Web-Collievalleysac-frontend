import { Input } from "../../../../atoms/Input/Input";
import { Button } from "../../../../atoms/Button/Button";
import { IconPicker, renderIcon } from "./IconPicker";

interface StatItem {
  icon: string;
  value: string;
  label: string;
  suffix?: string;
}

interface StatsEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function StatsEditor({ content, onChange }: StatsEditorProps) {
  const items: StatItem[] = (content.items as StatItem[]) || [];

  const updateItem = (index: number, field: keyof StatItem, value: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ ...content, items: updated });
  };

  const addItem = () => {
    onChange({
      ...content,
      items: [...items, { icon: "trending-up", value: "0", label: "Nueva estadística", suffix: "" }],
    });
  };

  const removeItem = (index: number) => {
    onChange({
      ...content,
      items: items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Configura las tarjetas de estadísticas. Selecciona un icono para cada
        una.
      </p>

      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <div className="flex-shrink-0 pt-5">
            {renderIcon(item.icon, "h-8 w-8 text-collie-600")}
          </div>
          <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Icono
              </label>
              <IconPicker
                value={item.icon}
                onChange={(icon) => updateItem(index, "icon", icon)}
              />
            </div>
            <Input
              label="Valor"
              value={item.value}
              onChange={(e) => updateItem(index, "value", e.target.value)}
              placeholder="150+"
            />
            <Input
              label="Etiqueta"
              value={item.label}
              onChange={(e) => updateItem(index, "label", e.target.value)}
              placeholder="Clientes activos"
            />
            <Input
              label="Sufijo (opcional)"
              value={item.suffix || ""}
              onChange={(e) => updateItem(index, "suffix", e.target.value)}
              placeholder="toneladas"
            />
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="mt-5 flex-shrink-0 rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
            title="Eliminar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addItem}>
        + Agregar estadística
      </Button>

      {items.length > 0 && (
        <div className="mt-4 rounded-lg border border-dashed border-collie-300 bg-collie-50 p-4">
          <p className="mb-2 text-xs font-medium text-collie-700">Vista previa</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="rounded-lg bg-white p-3 text-center shadow-sm">
                <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center text-collie-600">
                  {renderIcon(item.icon, "h-6 w-6")}
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {item.value}
                  {item.suffix && (
                    <span className="ml-1 text-xs text-gray-500">{item.suffix}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

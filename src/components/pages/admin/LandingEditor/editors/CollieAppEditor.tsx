import { useRef } from "react";
import { Input } from "../../../../atoms/Input/Input";
import { Button } from "../../../../atoms/Button/Button";

interface CollieAppContent {
  image_url?: string;
  features?: { title: string; description: string }[];
  cta_text?: string;
  cta_link?: string;
}

interface CollieAppEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function CollieAppEditor({ content, onChange }: CollieAppEditorProps) {
  const data = content as CollieAppContent;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof CollieAppContent, value: unknown) => {
    onChange({ ...content, [field]: value });
  };

  const features = data.features || [];

  const updateFeature = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    const updated = features.map((f, i) =>
      i === index ? { ...f, [field]: value } : f,
    );
    update("features", updated);
  };

  const addFeature = () => {
    update("features", [
      ...features,
      { title: "", description: "" },
    ]);
  };

  const removeFeature = (index: number) => {
    update(
      "features",
      features.filter((_, i) => i !== index),
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      update("image_url", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Configura la sección de Collie App en la landing page.
      </p>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-800">
          Imagen de la app
        </h4>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Input
              label="URL de imagen"
              value={data.image_url || ""}
              onChange={(e) => update("image_url", e.target.value)}
              placeholder="https://ejemplo.com/collie-app.png"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">o</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Subir imagen
              </Button>
              {data.image_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => update("image_url", "")}
                >
                  Quitar imagen
                </Button>
              )}
            </div>
          </div>
          {data.image_url && (
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-100">
              <img
                src={data.image_url}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).alt = "Error al cargar";
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-800">Botón CTA</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Texto del botón"
            value={data.cta_text || ""}
            onChange={(e) => update("cta_text", e.target.value)}
            placeholder="Conocer Collie App"
          />
          <Input
            label="Enlace"
            value={data.cta_link || ""}
            onChange={(e) => update("cta_link", e.target.value)}
            placeholder="/collie-app"
          />
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-800">
          Características
        </h4>
        {features.map((feature, index) => (
          <div
            key={index}
            className="mb-3 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <div className="flex-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Input
                label="Título"
                value={feature.title}
                onChange={(e) =>
                  updateFeature(index, "title", e.target.value)
                }
                placeholder="IA Predictiva"
              />
              <Input
                label="Descripción"
                value={feature.description}
                onChange={(e) =>
                  updateFeature(index, "description", e.target.value)
                }
                placeholder="Predicciones basadas en datos..."
              />
            </div>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="mt-5 rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addFeature}>
          + Agregar característica
        </Button>
      </div>
    </div>
  );
}

import { useRef } from "react";
import { Input } from "../../../../atoms/Input/Input";
import { Button } from "../../../../atoms/Button/Button";

interface ContactContent {
  qr_image?: string;
  qr_label?: string;
}

interface ContactEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function ContactEditor({ content, onChange }: ContactEditorProps) {
  const data = content as ContactContent;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof ContactContent, value: string) => {
    onChange({ ...content, [field]: value });
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
      update("qr_image", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Sube una imagen QR que se mostrará centrada por encima del formulario
        de contacto en la landing page.
      </p>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-800">Imagen QR</h4>
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-2">
            <Input
              label="URL de imagen (o sube un archivo)"
              value={data.qr_image || ""}
              onChange={(e) => update("qr_image", e.target.value)}
              placeholder="/assets/images/qr-collie-valley.jpg"
            />
            <div className="flex items-center gap-2">
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
                Subir imagen QR
              </Button>
              {data.qr_image && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => update("qr_image", "")}
                >
                  Quitar imagen
                </Button>
              )}
            </div>
          </div>
          {data.qr_image && (
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border bg-white p-1">
              <img
                src={data.qr_image}
                alt="QR Preview"
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      <Input
        label="Texto debajo del QR (opcional)"
        value={data.qr_label || ""}
        onChange={(e) => update("qr_label", e.target.value)}
        placeholder="Escanea para contactarnos"
      />

      <div className="rounded-lg border border-dashed border-collie-300 bg-collie-50 p-4">
        <p className="mb-2 text-xs font-medium text-collie-700">
          Vista previa de la sección contacto
        </p>
        <div className="rounded-lg bg-white p-6 text-center">
          {data.qr_image ? (
            <img
              src={data.qr_image}
              alt="QR"
              className="mx-auto h-40 w-40 object-contain"
            />
          ) : (
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
              QR aquí
            </div>
          )}
          {data.qr_label && (
            <p className="mt-2 text-sm text-gray-600">{data.qr_label}</p>
          )}
          <div className="mx-auto mt-4 h-24 w-full max-w-md rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
            Formulario de contacto
          </div>
        </div>
      </div>
    </div>
  );
}

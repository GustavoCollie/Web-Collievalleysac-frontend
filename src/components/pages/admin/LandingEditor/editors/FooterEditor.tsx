import { Input } from "../../../../atoms/Input/Input";

interface FooterContent {
  company_name?: string;
  company_description?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

interface FooterEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function FooterEditor({ content, onChange }: FooterEditorProps) {
  const data = content as FooterContent;

  const update = (field: keyof FooterContent, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Configura la información que se muestra en el footer de la página
        pública.
      </p>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-800">Empresa</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Nombre de empresa"
            value={data.company_name || ""}
            onChange={(e) => update("company_name", e.target.value)}
            placeholder="Collie Valley SAC"
          />
          <Input
            label="Descripción corta"
            value={data.company_description || ""}
            onChange={(e) => update("company_description", e.target.value)}
            placeholder="Exportación de productos agrícolas..."
          />
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-800">
          Datos de contacto
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            value={data.email || ""}
            onChange={(e) => update("email", e.target.value)}
            placeholder="info@collievalley.com"
          />
          <Input
            label="Teléfono"
            value={data.phone || ""}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+51 999 888 777"
          />
          <Input
            label="Dirección"
            value={data.address || ""}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Av. Principal 123, Lima"
          />
          <Input
            label="WhatsApp"
            value={data.whatsapp || ""}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="+51999888777"
          />
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-800">
          Redes sociales
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="LinkedIn URL"
            value={data.linkedin || ""}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="https://linkedin.com/company/collie-valley"
          />
          <Input
            label="Instagram URL"
            value={data.instagram || ""}
            onChange={(e) => update("instagram", e.target.value)}
            placeholder="https://instagram.com/collievalley"
          />
          <Input
            label="Facebook URL"
            value={data.facebook || ""}
            onChange={(e) => update("facebook", e.target.value)}
            placeholder="https://facebook.com/collievalley"
          />
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-collie-300 bg-collie-50 p-4">
        <p className="mb-2 text-xs font-medium text-collie-700">
          Vista previa del footer
        </p>
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-collie-900 p-4 text-white sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold">
              {data.company_name || "Collie Valley SAC"}
            </p>
            <p className="mt-1 text-xs text-collie-200">
              {data.company_description ||
                "Exportación de productos agrícolas premium del Perú al mundo."}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Contacto</p>
            <p className="mt-1 text-xs text-collie-200">
              {data.email || "info@collievalley.com"}
            </p>
            <p className="text-xs text-collie-200">
              {data.phone || "+51 999 888 777"}
            </p>
            {data.address && (
              <p className="text-xs text-collie-200">{data.address}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">Síguenos</p>
            <div className="mt-1 flex gap-2 text-xs text-collie-200">
              {data.linkedin && <span>LinkedIn</span>}
              {data.instagram && <span>Instagram</span>}
              {data.facebook && <span>Facebook</span>}
              {!data.linkedin && !data.instagram && !data.facebook && (
                <span>LinkedIn | Instagram</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

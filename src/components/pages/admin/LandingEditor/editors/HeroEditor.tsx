import { Input } from "../../../../atoms/Input/Input";

interface HeroContent {
  button_text?: string;
  button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
  background_image?: string;
}

interface HeroEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function HeroEditor({ content, onChange }: HeroEditorProps) {
  const heroContent = content as HeroContent;

  const update = (field: keyof HeroContent, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        El título y subtítulo se editan arriba. Aquí configura los botones y
        fondo del hero.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Texto botón principal"
          value={(heroContent.button_text as string) || ""}
          onChange={(e) => update("button_text", e.target.value)}
          placeholder="Comenzar ahora"
        />
        <Input
          label="Enlace botón principal"
          value={(heroContent.button_link as string) || ""}
          onChange={(e) => update("button_link", e.target.value)}
          placeholder="/register"
        />
        <Input
          label="Texto botón secundario"
          value={(heroContent.secondary_button_text as string) || ""}
          onChange={(e) => update("secondary_button_text", e.target.value)}
          placeholder="Ver productos"
        />
        <Input
          label="Enlace botón secundario"
          value={(heroContent.secondary_button_link as string) || ""}
          onChange={(e) => update("secondary_button_link", e.target.value)}
          placeholder="#productos"
        />
      </div>
      <div>
        <Input
          label="URL imagen de fondo (opcional)"
          value={(heroContent.background_image as string) || ""}
          onChange={(e) => update("background_image", e.target.value)}
          placeholder="https://ejemplo.com/hero-bg.jpg"
        />
        {heroContent.background_image && (
          <div className="mt-2 h-32 w-full overflow-hidden rounded-lg border">
            <img
              src={heroContent.background_image}
              alt="Preview fondo"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

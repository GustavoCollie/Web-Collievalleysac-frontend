import { useState, useEffect } from "react";

interface GenericEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function GenericEditor({ content, onChange }: GenericEditorProps) {
  const [jsonText, setJsonText] = useState(JSON.stringify(content, null, 2));
  const [error, setError] = useState("");

  useEffect(() => {
    setJsonText(JSON.stringify(content, null, 2));
  }, [content]);

  const handleChange = (value: string) => {
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      setError("");
      onChange(parsed);
    } catch {
      setError("JSON no válido");
    }
  };

  return (
    <div>
      <textarea
        className={`w-full rounded-lg border px-3 py-2 font-mono text-sm ${
          error ? "border-red-400" : "border-gray-300"
        }`}
        rows={8}
        value={jsonText}
        onChange={(e) => handleChange(e.target.value)}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import {
  landingService,
  type LandingSection,
} from "../../../../services/landingService";
import { Button } from "../../../atoms/Button/Button";
import { Input } from "../../../atoms/Input/Input";
import { Badge } from "../../../atoms/Badge/Badge";
import { H1 } from "../../../atoms/Typography/Typography";
import { Spinner } from "../../../atoms/Spinner/Spinner";

export function LandingEditor() {
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    subtitle: "",
    content: "",
    display_order: 0,
    is_visible: true,
  });
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newSection, setNewSection] = useState({
    section_key: "",
    title: "",
    subtitle: "",
    content: "{}",
    display_order: 0,
    is_visible: true,
  });

  const loadSections = useCallback(async () => {
    setLoading(true);
    try {
      const data = await landingService.getAllSections();
      setSections(data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const startEdit = (section: LandingSection) => {
    setEditingKey(section.section_key);
    setEditForm({
      title: section.title,
      subtitle: section.subtitle,
      content: JSON.stringify(section.content, null, 2),
      display_order: section.display_order,
      is_visible: section.is_visible,
    });
  };

  const handleSave = async () => {
    if (!editingKey) return;
    setSaving(true);
    try {
      let parsedContent: Record<string, unknown> = {};
      try {
        parsedContent = JSON.parse(editForm.content);
      } catch {
        alert("El contenido JSON no es válido");
        setSaving(false);
        return;
      }

      await landingService.updateSection(editingKey, {
        title: editForm.title,
        subtitle: editForm.subtitle,
        content: parsedContent,
        display_order: editForm.display_order,
        is_visible: editForm.is_visible,
      });
      setEditingKey(null);
      await loadSections();
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let parsedContent: Record<string, unknown> = {};
      try {
        parsedContent = JSON.parse(newSection.content);
      } catch {
        alert("El contenido JSON no es válido");
        setSaving(false);
        return;
      }

      await landingService.createSection({
        section_key: newSection.section_key,
        title: newSection.title,
        subtitle: newSection.subtitle,
        content: parsedContent,
        display_order: newSection.display_order,
        is_visible: newSection.is_visible,
      });
      setShowCreate(false);
      setNewSection({
        section_key: "",
        title: "",
        subtitle: "",
        content: "{}",
        display_order: 0,
        is_visible: true,
      });
      await loadSections();
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (window.confirm(`¿Eliminar la sección "${key}"?`)) {
      await landingService.deleteSection(key);
      await loadSections();
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <H1>Editor de Landing Page</H1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancelar" : "Nueva Sección"}
        </Button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-xl bg-white p-6 shadow-md"
        >
          <h3 className="mb-4 text-lg font-medium">Crear sección</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Clave (ej: hero, products, services)"
              value={newSection.section_key}
              onChange={(e) =>
                setNewSection((p) => ({ ...p, section_key: e.target.value }))
              }
              required
            />
            <Input
              label="Título"
              value={newSection.title}
              onChange={(e) =>
                setNewSection((p) => ({ ...p, title: e.target.value }))
              }
              required
            />
            <Input
              label="Subtítulo"
              value={newSection.subtitle}
              onChange={(e) =>
                setNewSection((p) => ({ ...p, subtitle: e.target.value }))
              }
            />
            <Input
              label="Orden"
              type="number"
              value={String(newSection.display_order)}
              onChange={(e) =>
                setNewSection((p) => ({
                  ...p,
                  display_order: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contenido (JSON)
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
              rows={6}
              value={newSection.content}
              onChange={(e) =>
                setNewSection((p) => ({ ...p, content: e.target.value }))
              }
            />
          </div>
          <Button type="submit" isLoading={saving} className="mt-4">
            Crear Sección
          </Button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {sections.map((section) => (
          <div
            key={section.section_key}
            className="rounded-xl bg-white p-6 shadow-md"
          >
            {editingKey === section.section_key ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Título"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                  <Input
                    label="Subtítulo"
                    value={editForm.subtitle}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, subtitle: e.target.value }))
                    }
                  />
                  <Input
                    label="Orden"
                    type="number"
                    value={String(editForm.display_order)}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        display_order: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editForm.is_visible}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            is_visible: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Visible</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Contenido (JSON)
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
                    rows={8}
                    value={editForm.content}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, content: e.target.value }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} isLoading={saving}>
                    Guardar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setEditingKey(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.section_key}
                    </h3>
                    <Badge
                      variant={section.is_visible ? "success" : "neutral"}
                    >
                      {section.is_visible ? "Visible" : "Oculta"}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      Orden: {section.display_order}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {section.title}
                  </p>
                  <p className="text-sm text-gray-500">{section.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(section)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(section.section_key)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {sections.length === 0 && (
          <p className="py-12 text-center text-gray-500">
            No hay secciones. Crea una para empezar.
          </p>
        )}
      </div>
    </div>
  );
}

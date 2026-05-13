import { useCallback, useEffect, useState } from "react";
import { adminService } from "../../../../services/adminService";
import { Button } from "../../../atoms/Button/Button";
import { Input } from "../../../atoms/Input/Input";
import { Badge } from "../../../atoms/Badge/Badge";
import { H1 } from "../../../atoms/Typography/Typography";
import { Spinner } from "../../../atoms/Spinner/Spinner";
import type { User, Role } from "../../../../types/user";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  importador: "Importador",
  exportador_broker: "Broker",
  agricultor: "Agricultor",
  exportador_collie: "Collie App",
};

const ROLE_VARIANTS: Record<string, "success" | "info" | "warning" | "danger" | "neutral"> = {
  admin: "danger",
  importador: "info",
  exportador_broker: "warning",
  agricultor: "success",
  exportador_collie: "neutral",
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "importador" as Role,
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminService.createUser(newUser);
      setShowCreate(false);
      setNewUser({ email: "", password: "", full_name: "", phone: "", role: "importador" });
      await loadUsers();
    } catch {
      // handle error
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    await adminService.updateUser(user.id, { is_active: !user.is_active });
    await loadUsers();
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      await adminService.deleteUser(userId);
      await loadUsers();
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
        <H1>Gestión de Usuarios</H1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancelar" : "Nuevo Usuario"}
        </Button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-xl bg-white p-6 shadow-md"
        >
          <h3 className="mb-4 text-lg font-medium">Crear usuario</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nombre completo"
              value={newUser.full_name}
              onChange={(e) =>
                setNewUser((p) => ({ ...p, full_name: e.target.value }))
              }
              required
            />
            <Input
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser((p) => ({ ...p, password: e.target.value }))
              }
              required
            />
            <Input
              label="Teléfono"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser((p) => ({ ...p, phone: e.target.value }))
              }
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, role: e.target.value as Role }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" isLoading={creating} className="mt-4">
            Crear
          </Button>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Nombre</th>
              <th className="px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 font-medium text-gray-500">Rol</th>
              <th className="px-6 py-3 font-medium text-gray-500">Estado</th>
              <th className="px-6 py-3 font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{user.full_name}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <Badge variant={ROLE_VARIANTS[user.role] || "neutral"}>
                    {ROLE_LABELS[user.role] || user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.is_active ? "success" : "danger"}>
                    {user.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(user)}
                    >
                      {user.is_active ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-6 text-center text-gray-500">No hay usuarios registrados.</p>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../atoms/Button/Button";
import { Input } from "../../../atoms/Input/Input";
import { authService } from "../../../../services/authService";
import type { Role } from "../../../../types/user";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "importador", label: "Importador de frutas" },
  { value: "exportador_broker", label: "Exportador (broker)" },
  { value: "agricultor", label: "Agricultor" },
  { value: "exportador_collie", label: "Exportador (Collie App)" },
];

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    role: "importador" as Role,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        role: formData.role,
      });
      navigate("/login", {
        state: { message: "Registro exitoso. Inicia sesión." },
      });
    } catch {
      setError("Error al registrar. Intenta con otro correo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Crear cuenta
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />

        <div className="w-full">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tipo de cuenta
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-collie-500 focus:outline-none focus:ring-2 focus:ring-collie-500/20"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Registrarse
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-collie-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

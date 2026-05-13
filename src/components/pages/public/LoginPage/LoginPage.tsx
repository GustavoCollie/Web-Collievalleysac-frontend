import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { Button } from "../../../atoms/Button/Button";
import { Input } from "../../../atoms/Input/Input";
import { DASHBOARD_ROUTES } from "../../../../routes/roleRoutes";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch {
      setError("Credenciales inválidas. Intenta nuevamente.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  // Redirect after user state updates
  useEffect(() => {
    if (user) {
      const dashboardPath = DASHBOARD_ROUTES[user.role] || "/";
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Iniciar sesión
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          required
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Ingresar
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-collie-600 hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

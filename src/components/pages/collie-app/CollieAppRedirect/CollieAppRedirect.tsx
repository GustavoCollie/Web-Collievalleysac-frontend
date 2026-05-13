import { useEffect, useState } from "react";
import { collieAppService } from "../../../../services/collieAppService";
import { Spinner } from "../../../atoms/Spinner/Spinner";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";
import { Button } from "../../../atoms/Button/Button";

export function CollieAppRedirect() {
  const [redirectUrl, setRedirectUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    collieAppService
      .getSSORedirect()
      .then(({ redirect_url }) => {
        setRedirectUrl(redirect_url);
        window.open(redirect_url, "_blank");
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500">Conectando con Collie App...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <H1>Error de conexión</H1>
        <Paragraph>No se pudo conectar con Collie App. Intenta nuevamente.</Paragraph>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <H1>Collie App abierta</H1>
      <Paragraph>Se abrió Collie App en una nueva pestaña.</Paragraph>
      {redirectUrl && (
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-collie-600 px-6 py-2 text-white hover:bg-collie-700"
        >
          Abrir de nuevo
        </a>
      )}
    </div>
  );
}

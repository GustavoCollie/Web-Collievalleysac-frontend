import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { landingService } from "../../../../services/landingService";
import type { LandingSection } from "../../../../services/landingService";
import { Spinner } from "../../../atoms/Spinner/Spinner";

// Default content used as fallback when API hasn't loaded yet
const DEFAULT_PRODUCTS = [
  { name: "Palta Hass", desc: "Calibres premium, exportación todo el año" },
  { name: "Mandarina", desc: "Dulce y jugosa, ideal para mercados europeos" },
  { name: "Paprika", desc: "Seca y molida, alta concentración de color" },
  { name: "Arándanos", desc: "Berries frescos de contraestación" },
];

const DEFAULT_SERVICES = [
  {
    title: "Broker Internacional",
    desc: "Conectamos exportadores con compradores globales. Gestión de logística, documentación y certificaciones.",
  },
  {
    title: "Asesoría Agronómica",
    desc: "Expertos en campo que optimizan tu producción para cumplir estándares internacionales.",
  },
  {
    title: "Collie App",
    desc: "Sistema de gestión con IA para agroexportadores. Forecast, alertas y métricas en tiempo real.",
  },
];

function getSectionContent(
  sections: LandingSection[],
  key: string,
): LandingSection | undefined {
  return sections.find((s) => s.section_key === key);
}

export function LandingPage() {
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    landingService
      .getPublicSections()
      .then(setSections)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hero = getSectionContent(sections, "hero");
  const productsSection = getSectionContent(sections, "products");
  const servicesSection = getSectionContent(sections, "services");
  const ctaSection = getSectionContent(sections, "cta");

  const products = (productsSection?.content?.items as typeof DEFAULT_PRODUCTS) || DEFAULT_PRODUCTS;
  const services = (servicesSection?.content?.items as typeof DEFAULT_SERVICES) || DEFAULT_SERVICES;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Collie Valley SAC - Agroexportación Premium del Perú</title>
        <meta
          name="description"
          content="Exportación de palta hass, mandarina, paprika y arándanos. Servicios de broker internacional, asesoría agronómica y Collie App con IA."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-collie-700 to-collie-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {hero?.title || "Del campo peruano al mundo"}
            </h1>
            <p className="mt-6 text-lg text-collie-100">
              {hero?.subtitle ||
                "Palta Hass, mandarina, paprika y arándanos de la más alta calidad. Exportamos frescura, confianza y compromiso."}
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="rounded-lg bg-white px-6 py-3 font-medium text-collie-700 hover:bg-collie-50"
              >
                Comenzar ahora
              </Link>
              <a
                href="#productos"
                className="rounded-lg border-2 border-white px-6 py-3 font-medium text-white hover:bg-white/10"
              >
                Ver productos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section id="productos" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {productsSection?.title || "Nuestros Productos"}
          </h2>
          <p className="mt-4 text-center text-gray-600">
            {productsSection?.subtitle ||
              "Productos agrícolas premium certificados para exportación"}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map(
              (product: { name: string; desc: string }) => (
                <div
                  key={product.name}
                  className="rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4 h-40 rounded-lg bg-collie-100" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{product.desc}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="bg-earth-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {servicesSection?.title || "Servicios"}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map(
              (service: { title: string; desc: string }) => (
                <div
                  key={service.title}
                  className="rounded-xl bg-white p-6 shadow-md"
                >
                  <div className="mb-4 h-12 w-12 rounded-lg bg-collie-100" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{service.desc}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-collie-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            {ctaSection?.title || "¿Listo para exportar con nosotros?"}
          </h2>
          <p className="mt-4 text-collie-100">
            {ctaSection?.subtitle ||
              "Regístrate y accede a nuestra plataforma de comercio internacional."}
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-medium text-collie-700 hover:bg-collie-50"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>
    </>
  );
}

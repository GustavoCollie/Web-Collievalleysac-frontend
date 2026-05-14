import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { landingService } from "../../../../services/landingService";
import type { LandingSection } from "../../../../services/landingService";
import { Spinner } from "../../../atoms/Spinner/Spinner";
import { renderIcon } from "../../admin/LandingEditor/editors/IconPicker";

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

const DEFAULT_STATS = [
  { icon: "globe", value: "15+", label: "Países de exportación" },
  { icon: "package", value: "5,000", label: "Toneladas anuales", suffix: "TN" },
  { icon: "users", value: "200+", label: "Productores asociados" },
  { icon: "award", value: "10", label: "Años de experiencia" },
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
  const statsSection = getSectionContent(sections, "stats");
  const ctaSection = getSectionContent(sections, "cta");
  const contactSection = getSectionContent(sections, "contact");
  const collieAppSection = getSectionContent(sections, "collie_app");

  const products =
    (productsSection?.content?.items as typeof DEFAULT_PRODUCTS) ||
    DEFAULT_PRODUCTS;
  const services =
    (servicesSection?.content?.items as typeof DEFAULT_SERVICES) ||
    DEFAULT_SERVICES;
  const stats =
    (statsSection?.content?.items as typeof DEFAULT_STATS) || DEFAULT_STATS;

  // Hero content fields
  const heroContent = hero?.content as {
    button_text?: string;
    button_link?: string;
    secondary_button_text?: string;
    secondary_button_link?: string;
    background_image?: string;
  } | undefined;

  // Contact content fields (QR)
  const contactContent = contactSection?.content as {
    qr_image?: string;
    qr_label?: string;
  } | undefined;

  // Collie App content fields
  const collieAppContent = collieAppSection?.content as {
    image_url?: string;
    features?: { title: string; description: string }[];
    cta_text?: string;
    cta_link?: string;
  } | undefined;

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
      <section
        className="relative bg-gradient-to-br from-collie-700 to-collie-900 py-24 text-white"
        style={
          heroContent?.background_image
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${heroContent.background_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
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
                to={heroContent?.button_link || "/register"}
                className="rounded-lg bg-white px-6 py-3 font-medium text-collie-700 hover:bg-collie-50"
              >
                {heroContent?.button_text || "Comenzar ahora"}
              </Link>
              <a
                href={heroContent?.secondary_button_link || "#productos"}
                className="rounded-lg border-2 border-white px-6 py-3 font-medium text-white hover:bg-white/10"
              >
                {heroContent?.secondary_button_text || "Ver productos"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(
              (
                stat: {
                  icon: string;
                  value: string;
                  label: string;
                  suffix?: string;
                },
                index: number,
              ) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-collie-100 text-collie-600">
                    {renderIcon(stat.icon, "h-6 w-6")}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    {stat.suffix && (
                      <span className="ml-1 text-sm font-normal text-gray-500">
                        {stat.suffix}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
                </div>
              ),
            )}
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
            {products.map((product: { name: string; desc: string }) => (
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
            ))}
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
            {services.map((service: { title: string; desc: string }) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* Collie App */}
      {collieAppSection && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {collieAppSection.title || "Collie App"}
                </h2>
                <p className="mt-4 text-gray-600">
                  {collieAppSection.subtitle ||
                    "Sistema de gestión con IA para agroexportadores."}
                </p>
                {collieAppContent?.features &&
                  collieAppContent.features.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {collieAppContent.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg
                            className="mt-0.5 h-5 w-5 flex-shrink-0 text-collie-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">
                              {feature.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {feature.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                {collieAppContent?.cta_text && (
                  <Link
                    to={collieAppContent.cta_link || "/collie-app"}
                    className="mt-8 inline-block rounded-lg bg-collie-600 px-6 py-3 font-medium text-white hover:bg-collie-700"
                  >
                    {collieAppContent.cta_text}
                  </Link>
                )}
              </div>
              <div className="flex justify-center">
                {collieAppContent?.image_url ? (
                  <img
                    src={collieAppContent.image_url}
                    alt="Collie App"
                    className="max-h-96 rounded-2xl shadow-xl"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-collie-100">
                    <span className="text-collie-400">Imagen de la app</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      <section id="contacto" className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {contactSection?.title || "Contacto"}
          </h2>
          {contactSection?.subtitle && (
            <p className="mt-4 text-center text-gray-600">
              {contactSection.subtitle}
            </p>
          )}

          {/* QR Image */}
          <div className="mt-8 flex flex-col items-center">
            <img
              src={
                contactContent?.qr_image ||
                "/assets/images/qr-collie-valley.jpg"
              }
              alt="QR Collie Valley"
              className="h-48 w-48 object-contain"
            />
            {contactContent?.qr_label && (
              <p className="mt-3 text-sm text-gray-500">
                {contactContent.qr_label}
              </p>
            )}
          </div>

          {/* Contact Form */}
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Mensaje enviado. Nos pondremos en contacto pronto.");
            }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-collie-500 focus:outline-none focus:ring-2 focus:ring-collie-500/20"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-collie-500 focus:outline-none focus:ring-2 focus:ring-collie-500/20"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mensaje
              </label>
              <textarea
                required
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-collie-500 focus:outline-none focus:ring-2 focus:ring-collie-500/20"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="rounded-lg bg-collie-600 px-8 py-3 font-medium text-white hover:bg-collie-700"
              >
                Enviar mensaje
              </button>
            </div>
          </form>
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

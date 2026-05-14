import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { landingService } from "../../../services/landingService";
import type { LandingSection } from "../../../services/landingService";

interface FooterData {
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

export function PublicLayout() {
  const [footerData, setFooterData] = useState<FooterData>({});

  useEffect(() => {
    landingService
      .getPublicSections()
      .then((sections: LandingSection[]) => {
        const footerSection = sections.find(
          (s) => s.section_key === "footer",
        );
        if (footerSection) {
          setFooterData(footerSection.content as FooterData);
        }
      })
      .catch(() => {});
  }, []);

  const companyName = footerData.company_name || "Collie Valley SAC";
  const companyDesc =
    footerData.company_description ||
    "Exportación de productos agrícolas premium del Perú al mundo.";
  const email = footerData.email || "info@collievalley.com";
  const phone = footerData.phone || "+51 999 888 777";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-collie-600" />
            <span className="text-xl font-bold text-collie-800">
              Collie Valley
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#productos" className="text-sm text-gray-600 hover:text-collie-600">
              Productos
            </a>
            <a href="#servicios" className="text-sm text-gray-600 hover:text-collie-600">
              Servicios
            </a>
            <a href="#nosotros" className="text-sm text-gray-600 hover:text-collie-600">
              Nosotros
            </a>
            <Link
              to="/login"
              className="rounded-lg bg-collie-600 px-4 py-2 text-sm font-medium text-white hover:bg-collie-700"
            >
              Ingresar
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-collie-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{companyName}</h3>
              <p className="text-collie-200 text-sm">{companyDesc}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="text-collie-200 text-sm">{email}</p>
              <p className="text-collie-200 text-sm">{phone}</p>
              {footerData.address && (
                <p className="text-collie-200 text-sm mt-1">
                  {footerData.address}
                </p>
              )}
              {footerData.whatsapp && (
                <a
                  href={`https://wa.me/${footerData.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-collie-300 hover:text-white"
                >
                  WhatsApp
                </a>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex flex-col gap-2">
                {footerData.linkedin ? (
                  <a
                    href={footerData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-collie-200 text-sm hover:text-white"
                  >
                    LinkedIn
                  </a>
                ) : (
                  <span className="text-collie-200 text-sm">LinkedIn</span>
                )}
                {footerData.instagram ? (
                  <a
                    href={footerData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-collie-200 text-sm hover:text-white"
                  >
                    Instagram
                  </a>
                ) : (
                  <span className="text-collie-200 text-sm">Instagram</span>
                )}
                {footerData.facebook && (
                  <a
                    href={footerData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-collie-200 text-sm hover:text-white"
                  >
                    Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-collie-800 pt-8 text-center text-sm text-collie-300">
            &copy; {new Date().getFullYear()} {companyName}. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

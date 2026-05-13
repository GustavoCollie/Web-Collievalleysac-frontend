import { Outlet, Link } from "react-router-dom";

export function PublicLayout() {
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
              <h3 className="text-lg font-semibold mb-4">Collie Valley SAC</h3>
              <p className="text-collie-200 text-sm">
                Exportación de productos agrícolas premium del Perú al mundo.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="text-collie-200 text-sm">info@collievalley.com</p>
              <p className="text-collie-200 text-sm">+51 999 888 777</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <p className="text-collie-200 text-sm">LinkedIn | Instagram</p>
            </div>
          </div>
          <div className="mt-8 border-t border-collie-800 pt-8 text-center text-sm text-collie-300">
            &copy; 2026 Collie Valley SAC. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

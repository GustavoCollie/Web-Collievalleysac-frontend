import { Outlet, Link } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-collie-50 to-earth-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-collie-600" />
            <span className="text-2xl font-bold text-collie-800">
              Collie Valley
            </span>
          </Link>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

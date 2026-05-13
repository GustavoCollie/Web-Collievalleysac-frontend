import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../components/templates/RootLayout/RootLayout";
import { PublicLayout } from "../components/templates/PublicLayout/PublicLayout";
import { AuthLayout } from "../components/templates/AuthLayout/AuthLayout";
import { DashboardLayout } from "../components/templates/DashboardLayout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Spinner } from "../components/atoms/Spinner/Spinner";

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import("../components/pages/public/LandingPage/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("../components/pages/public/LoginPage/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("../components/pages/public/RegisterPage/RegisterPage").then(m => ({ default: m.RegisterPage })));

const AdminDashboard = lazy(() => import("../components/pages/admin/AdminDashboard/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const UserManagement = lazy(() => import("../components/pages/admin/UserManagement/UserManagement").then(m => ({ default: m.UserManagement })));
const LandingEditor = lazy(() => import("../components/pages/admin/LandingEditor/LandingEditor").then(m => ({ default: m.LandingEditor })));

const ImporterDashboard = lazy(() => import("../components/pages/importer/ImporterDashboard/ImporterDashboard").then(m => ({ default: m.ImporterDashboard })));
const ProductCatalog = lazy(() => import("../components/pages/importer/ProductCatalog/ProductCatalog").then(m => ({ default: m.ProductCatalog })));
const OrderCreate = lazy(() => import("../components/pages/importer/OrderCreate/OrderCreate").then(m => ({ default: m.OrderCreate })));
const OrderHistory = lazy(() => import("../components/pages/importer/OrderHistory/OrderHistory").then(m => ({ default: m.OrderHistory })));

const BrokerDashboard = lazy(() => import("../components/pages/broker/BrokerDashboard/BrokerDashboard").then(m => ({ default: m.BrokerDashboard })));
const BrokerageRequestPage = lazy(() => import("../components/pages/broker/BrokerageRequest/BrokerageRequest").then(m => ({ default: m.BrokerageRequestPage })));
const MarketIndicators = lazy(() => import("../components/pages/broker/MarketIndicators/MarketIndicators").then(m => ({ default: m.MarketIndicators })));

const FarmerDashboard = lazy(() => import("../components/pages/farmer/FarmerDashboard/FarmerDashboard").then(m => ({ default: m.FarmerDashboard })));
const AdvisoryRequestPage = lazy(() => import("../components/pages/farmer/AdvisoryRequest/AdvisoryRequest").then(m => ({ default: m.AdvisoryRequestPage })));
const TechnicalArticles = lazy(() => import("../components/pages/farmer/TechnicalArticles/TechnicalArticles").then(m => ({ default: m.TechnicalArticles })));
const CropCalendar = lazy(() => import("../components/pages/farmer/CropCalendar/CropCalendar").then(m => ({ default: m.CropCalendar })));

const CollieAppDashboard = lazy(() => import("../components/pages/collie-app/CollieAppDashboard/CollieAppDashboard").then(m => ({ default: m.CollieAppDashboard })));
const CollieAppRedirect = lazy(() => import("../components/pages/collie-app/CollieAppRedirect/CollieAppRedirect").then(m => ({ default: m.CollieAppRedirect })));

function LazyFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner />
    </div>
  );
}

function L({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LazyFallback />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    // Root layout provides AuthProvider to all routes
    element: <RootLayout />,
    children: [
      // Public routes
      {
        element: <PublicLayout />,
        children: [{ index: true, element: <L><LandingPage /></L> }],
      },

      // Auth routes
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <L><LoginPage /></L> },
          { path: "register", element: <L><RegisterPage /></L> },
        ],
      },

      // Admin dashboard
      {
        path: "admin",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <L><AdminDashboard /></L> },
          { path: "users", element: <L><UserManagement /></L> },
          { path: "landing", element: <L><LandingEditor /></L> },
        ],
      },

      // Importer dashboard
      {
        path: "importer",
        element: (
          <ProtectedRoute roles={["importador"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <L><ImporterDashboard /></L> },
          { path: "catalog", element: <L><ProductCatalog /></L> },
          { path: "orders/new", element: <L><OrderCreate /></L> },
          { path: "orders", element: <L><OrderHistory /></L> },
        ],
      },

      // Broker dashboard
      {
        path: "broker",
        element: (
          <ProtectedRoute roles={["exportador_broker"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <L><BrokerDashboard /></L> },
          { path: "request", element: <L><BrokerageRequestPage /></L> },
          { path: "market", element: <L><MarketIndicators /></L> },
        ],
      },

      // Farmer dashboard
      {
        path: "farmer",
        element: (
          <ProtectedRoute roles={["agricultor"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <L><FarmerDashboard /></L> },
          { path: "advisory", element: <L><AdvisoryRequestPage /></L> },
          { path: "articles", element: <L><TechnicalArticles /></L> },
          { path: "calendar", element: <L><CropCalendar /></L> },
        ],
      },

      // Collie App dashboard
      {
        path: "collie-app",
        element: (
          <ProtectedRoute roles={["exportador_collie"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <L><CollieAppDashboard /></L> },
          { path: "redirect", element: <L><CollieAppRedirect /></L> },
        ],
      },

      // Unauthorized
      {
        path: "unauthorized",
        element: (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-600">403</h1>
              <p className="mt-2 text-gray-600">No tienes acceso a esta sección.</p>
            </div>
          </div>
        ),
      },

      // Catch-all
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

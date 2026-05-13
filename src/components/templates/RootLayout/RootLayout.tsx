import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../../context/AuthContext";

export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

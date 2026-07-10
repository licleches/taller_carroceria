import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logEvent } from "../../lib/logger";
import { getRequestMeta, getClientIP } from "../../lib/requestMeta";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    const { client, userAgent, referer } = getRequestMeta();
    getClientIP().then((ip) => {
      logEvent({
        category: "AUTHZ", severity: "WARNING",
        user: "anónimo", ip, method: "GET",
        resource: location.pathname, statusCode: 302,
        message: "Acceso denegado — redirigido a login",
        client, userAgent, referer,
      });
    });
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

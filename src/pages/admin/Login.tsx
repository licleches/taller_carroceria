import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { detectAttack, detectBruteForce, resetBruteForce } from "../../lib/attackDetection";
import { logEvent } from "../../lib/logger";
import { getRequestMeta, getClientIP } from "../../lib/requestMeta";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

 if (user) {
  return <Navigate to="/admin/dashboard" replace />;
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const ip = await getClientIP();
    const attackResult = detectAttack(email) || detectAttack(password);
    if (attackResult.isAttack) {
      const meta = getRequestMeta();
      logEvent({ category: "ATTACK", severity: "WARNING", user: email, ip, method: "POST", resource: "/admin/login", statusCode: 400, message: `Intento de ataque bloqueado en login: ${attackResult.types.join(", ")}`, client: meta.client, userAgent: meta.userAgent, referer: meta.referer });
      setError("Credenciales inválidas.");
      return;
    }

    const bf = detectBruteForce(ip);
    if (bf.blocked) {
      const meta = getRequestMeta();
      logEvent({ category: "ATTACK", severity: "WARNING", user: email, ip, method: "POST", resource: "/admin/login", statusCode: 429, message: "Bloqueado por fuerza bruta", client: meta.client, userAgent: meta.userAgent, referer: meta.referer });
      setError("Demasiados intentos. Intenta de nuevo en 1 minuto.");
      return;
    }

    const err = await login(email, password);
    if (err) {
      setError(err);
    } else {
      resetBruteForce(ip);
      navigate("/admin/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#231F20" }}>
            Admin Panel
          </h1>
          <p className="text-gray-500 mt-2">Inicia sesión para gestionar cotizaciones</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
              placeholder="admin@desertjewel.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-lg rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

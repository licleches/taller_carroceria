import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLogs, clearLogs, type LogEntry } from "../../lib/logger";
import { logEvent } from "../../lib/logger";
import {
  LogOut, ArrowLeft, Download, Trash2, Search, Shield,
  AlertTriangle, Eye, X, Filter, Activity,
} from "lucide-react";

type CategoryFilter = "ALL" | "AUTH" | "AUTHZ" | "ADMIN" | "ERROR" | "VISIT" | "ATTACK";
type SeverityFilter = "ALL" | "INFO" | "WARNING" | "ERROR";

const categoryColors: Record<string, string> = {
  AUTH: "bg-purple-100 text-purple-700",
  AUTHZ: "bg-orange-100 text-orange-700",
  ADMIN: "bg-blue-100 text-blue-700",
  ERROR: "bg-red-100 text-red-700",
  VISIT: "bg-gray-100 text-gray-700",
  ATTACK: "bg-rose-100 text-rose-700",
};

const severityColors: Record<string, string> = {
  INFO: "bg-green-100 text-green-700",
  WARNING: "bg-amber-100 text-amber-700",
  ERROR: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
}

function statusBadge(code: number) {
  if (code >= 200 && code < 300) return "bg-green-100 text-green-700";
  if (code >= 300 && code < 400) return "bg-blue-100 text-blue-700";
  if (code >= 400 && code < 500) return "bg-amber-100 text-amber-700";
  if (code >= 500) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");
  const [search, setSearch] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const loadLogs = useCallback(() => {
    setLogs(getLogs());
  }, []);

  useEffect(() => {
    loadLogs();
    intervalRef.current = setInterval(loadLogs, 4000);
    return () => clearInterval(intervalRef.current);
  }, [loadLogs]);

  const filtered = logs.filter((e) => {
    if (categoryFilter !== "ALL" && e.category !== categoryFilter) return false;
    if (severityFilter !== "ALL" && e.severity !== severityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !e.user.toLowerCase().includes(q) &&
        !e.ip.toLowerCase().includes(q) &&
        !e.resource.toLowerCase().includes(q) &&
        !e.message.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const handleClear = () => {
    logEvent({
      category: "ADMIN", severity: "INFO",
      user: user?.email || "admin",
      ip: "localhost", method: "DELETE", resource: "/api/admin/logs",
      statusCode: 200,
      message: "Logs limpiados por administrador",
    });
    clearLogs();
    setShowClearConfirm(false);
    loadLogs();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `logs-${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = ["Fecha", "Categoría", "Severidad", "Usuario", "IP", "Método", "Recurso", "Código", "Mensaje", "AttackTypes"];
    const rows = filtered.map((e) => [
      formatDate(e.timestamp), e.category, e.severity, e.user, e.ip,
      e.method, e.resource, e.statusCode, `"${e.message.replace(/"/g, '""')}"`,
      e.attackTypes?.join("; ") || "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const summary = {
    total: logs.length,
    visits: logs.filter((e) => e.category === "VISIT").length,
    attacks: logs.filter((e) => e.category === "ATTACK").length,
    denied: logs.filter((e) => e.category === "AUTHZ").length,
    errors: logs.filter((e) => e.severity === "ERROR").length,
  };

  const ipActivity = Object.entries(
    logs.reduce<Record<string, { count: number; lastSeen: string; categories: Set<string> }>>((acc, e) => {
      if (!acc[e.ip]) acc[e.ip] = { count: 0, lastSeen: e.timestamp, categories: new Set() };
      acc[e.ip].count++;
      if (e.timestamp > acc[e.ip].lastSeen) acc[e.ip].lastSeen = e.timestamp;
      acc[e.ip].categories.add(e.category);
      return acc;
    }, {})
  ).sort((a, b) => b[1].count - a[1].count).slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin")} className="text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Visor de Logs</h1>
            <p className="text-sm text-gray-400">{logs.length} eventos registrados</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportJSON} className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm">
            <Download size={15} /> JSON
          </button>
          <button onClick={exportCSV} className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm">
            <Download size={15} /> CSV
          </button>
          <button onClick={() => setShowClearConfirm(true)} className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-sm">
            <Trash2 size={15} /> Limpiar
          </button>
          <button onClick={() => { logout(); navigate("/admin/login"); }} className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm">
            <LogOut size={15} /> Salir
          </button>
        </div>
      </header>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowClearConfirm(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3" style={{ color: "#231F20" }}>¿Limpiar todos los logs?</h3>
            <p className="text-gray-600 text-sm mb-6">Esta acción dejará un rastro de auditoría. No se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowClearConfirm(false)} className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleClear} className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium">
                Limpiar todo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Total", value: summary.total, color: "text-zinc-900", bg: "bg-white" },
            { label: "Visitas", value: summary.visits, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Ataques", value: summary.attacks, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Denegados", value: summary.denied, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Errores", value: summary.errors, color: "text-red-600", bg: "bg-red-50" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 shadow-sm border border-gray-100 ${s.bg}`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter size={14} />
            <span>Filtros:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white"
          >
            <option value="ALL">Todas las categorías</option>
            <option value="AUTH">AUTH</option>
            <option value="AUTHZ">AUTHZ</option>
            <option value="ADMIN">ADMIN</option>
            <option value="ERROR">ERROR</option>
            <option value="VISIT">VISIT</option>
            <option value="ATTACK">ATTACK</option>
          </select>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as SeverityFilter)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white"
          >
            <option value="ALL">Todas las severidades</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por usuario, IP, recurso o mensaje..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{filtered.length} de {logs.length}</span>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Categoría</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Severidad</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Usuario</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">IP</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Método</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Recurso</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Código</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-gray-400">
                      <Eye size={32} className="mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No hay eventos</p>
                      <p className="text-sm mt-1">Los eventos aparecerán aquí cuando ocurran</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.eventId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs font-mono">{formatDate(e.timestamp)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[e.category] || ""}`}>
                          {e.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColors[e.severity] || ""}`}>
                          {e.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-[120px] truncate">{e.user}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs font-mono">{e.ip}</td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{e.method}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate">{e.resource}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${statusBadge(e.statusCode)}`}>
                          {e.statusCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px] truncate" title={e.message}>
                        {e.category === "ATTACK" && e.attackTypes ? (
                          <span className="flex items-center gap-1">
                            <Shield size={12} className="text-rose-500 shrink-0" />
                            <span className="truncate">{e.message}</span>
                          </span>
                        ) : e.severity === "ERROR" ? (
                          <span className="flex items-center gap-1">
                            <AlertTriangle size={12} className="text-red-500 shrink-0" />
                            <span className="truncate">{e.message}</span>
                          </span>
                        ) : (
                          <span className="truncate">{e.message}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {ipActivity.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} className="text-brand-600" />
              <h2 className="text-lg font-bold" style={{ color: "#231F20" }}>Actividad por IP</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">IP</th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">Peticiones</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Categorías</th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">Última vez</th>
                  </tr>
                </thead>
                <tbody>
                  {ipActivity.map(([ip, data]) => (
                    <tr key={ip} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-xs text-gray-700">{ip}</td>
                      <td className="px-3 py-2 text-right font-bold" style={{ color: "#006837" }}>{data.count}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1 flex-wrap">
                          {Array.from(data.categories).map((c) => (
                            <span key={c} className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[c] || ""}`}>{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-xs text-gray-400">{formatDate(data.lastSeen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

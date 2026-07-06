import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Search, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

interface Quote {
  id: string;
  created_at: string;
  nombre: string;
  telefono: string;
  email: string;
  marca: string;
  modelo: string;
  año: string;
  servicio: string;
  status: string;
}

type StatusFilter = "todas" | "pendiente" | "respondida" | "revisado" | "cancelada";

export default function QuotesList() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todas");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setQuotes(data as Quote[]);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const filtered = quotes.filter((q) => {
    if (statusFilter !== "todas" && q.status !== statusFilter) return false;

    if (dateStart || dateEnd) {
      const d = new Date(q.created_at);
      if (dateStart && d < new Date(dateStart + "T00:00:00")) return false;
      if (dateEnd) {
        const endDate = new Date(dateEnd + "T23:59:59");
        if (d > endDate) return false;
      }
    }

    if (search) {
      const s = search.toLowerCase();
      return (
        q.nombre.toLowerCase().includes(s) ||
        q.marca.toLowerCase().includes(s) ||
        q.modelo.toLowerCase().includes(s)
      );
    }

    return true;
  });

  const statusIcon = (status: string) => {
    if (status === "respondida") return <CheckCircle size={14} className="text-brand-500" />;
    if (status === "cancelada") return <XCircle size={14} className="text-red-500" />;
    if (status === "revisado") return <Clock size={14} className="text-blue-500" />;
    return <Clock size={14} className="text-amber-500" />;
  };

  const statusStyle = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      respondida: { bg: "#e6f7ef", color: "#006837" },
      cancelada: { bg: "#fee2e2", color: "#dc2626" },
      revisado: { bg: "#dbeafe", color: "#2563eb" },
      pendiente: { bg: "#fef3c7", color: "#d97706" },
    };
    return map[status] ?? map.pendiente;
  };

  const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: "todas", label: "Todas" },
    { value: "pendiente", label: "Pendiente" },
    { value: "respondida", label: "Respondida" },
    { value: "revisado", label: "Revisado" },
    { value: "cancelada", label: "Cancelada" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Cotizaciones</h1>
            <p className="text-sm text-gray-400">{quotes.length} total · {filtered.length} filtradas</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm">
          <LogOut size={15} /> Salir
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ─── Filtros ─── */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fecha inicio */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fecha inicial</label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            {/* Fecha fin */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fecha final</label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatusFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      statusFilter === opt.value
                        ? "text-white border-transparent"
                        : "text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                    style={statusFilter === opt.value ? { backgroundColor: "#006837" } : {}}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Buscador */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nombre, marca o modelo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Lista ─── */}
        {loading ? (
          <p className="text-center text-gray-500 py-20">Cargando cotizaciones...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">
              {search || dateStart || dateEnd || statusFilter !== "todas"
                ? "No se encontraron cotizaciones con esos filtros"
                : "No hay cotizaciones aún"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((quote) => (
              <Link
                key={quote.id}
                to={`/admin/quote/${quote.id}`}
                className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-base truncate" style={{ color: "#231F20" }}>
                        {quote.nombre}
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                        style={statusStyle(quote.status)}
                      >
                        {statusIcon(quote.status)}
                        {quote.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {quote.marca} {quote.modelo} ({quote.año}) — {quote.servicio}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(quote.created_at).toLocaleDateString("es-MX", {
                        year: "numeric", month: "long", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-brand-600 font-medium text-sm">{quote.telefono}</p>
                    {quote.email && <p className="text-xs text-gray-400 mt-0.5">{quote.email}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

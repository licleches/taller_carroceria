import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Calendar, FileText, Clock, Users } from "lucide-react";

interface TodayAppointment {
  id: string;
  nombre: string;
  telefono: string;
  servicio: string;
  hora: string;
  marca: string;
  modelo: string;
  status: string;
}

interface TodayQuote {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  servicio: string;
  status: string;
  created_at: string;
}

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

function todayDateString() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminHome() {
  const [appointments, setAppointments] = useState<TodayAppointment[]>([]);
  const [quotes, setQuotes] = useState<TodayQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadToday();
  }, []);

  const loadToday = async () => {
    setLoading(true);
    const range = todayRange();
    const today = todayDateString();

    const [appRes, quotesRes] = await Promise.all([
      supabase
        .from("appointments")
        .select("*")
        .gte("fecha", today)
        .lte("fecha", today)
        .order("hora", { ascending: true }),
      supabase
        .from("quotes")
        .select("id, nombre, marca, modelo, servicio, status, created_at")
        .gte("created_at", range.start)
        .lte("created_at", range.end)
        .order("created_at", { ascending: false }),
    ]);

    if (!appRes.error && appRes.data) setAppointments(appRes.data);
    if (!quotesRes.error && quotesRes.data) setQuotes(quotesRes.data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      pendiente: { bg: "#fef3c7", color: "#d97706" },
      respondida: { bg: "#e6f7ef", color: "#006837" },
      revisado: { bg: "#dbeafe", color: "#2563eb" },
      cancelada: { bg: "#fee2e2", color: "#dc2626" },
      confirmada: { bg: "#e6f7ef", color: "#006837" },
    };
    const s = map[status] ?? map.pendiente;
    return (
      <span
        className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
        style={{ backgroundColor: s.bg, color: s.color }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Panel Admin — Desert Jewel</h1>
          <p className="text-sm text-gray-400">{formatDate(new Date().toISOString())}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/quotes" className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
            <FileText size={15} /> Cotizaciones
          </Link>
          <Link to="/admin/calendar" className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
            <Calendar size={15} /> Calendario
          </Link>
          <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm">
            <LogOut size={15} /> Salir
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-center text-gray-500 py-20">Cargando información del día...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ─── Citas de Hoy ─── */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#231F20" }}>Citas de Hoy</h2>
                  <p className="text-xs text-gray-400">{appointments.length} cita{appointments.length !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No hay citas programadas para hoy</p>
                  <p className="text-sm mt-1">Los clientes pueden agendar desde la página pública</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold" style={{ color: "#231F20" }}>{apt.nombre}</h3>
                        <span className="text-sm font-bold whitespace-nowrap text-brand-600">{apt.hora} hrs</span>
                      </div>
                      <p className="text-sm text-gray-600">{apt.servicio}</p>
                      {apt.marca && (
                        <p className="text-xs text-gray-400 mt-1">{apt.marca} {apt.modelo}</p>
                      )}
                      <div className="mt-2">{statusBadge(apt.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Cotizaciones de Hoy ─── */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <FileText size={20} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#231F20" }}>Cotizaciones de Hoy</h2>
                  <p className="text-xs text-gray-400">{quotes.length} cotización{quotes.length !== 1 ? "es" : ""}</p>
                </div>
              </div>

              {quotes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No hay cotizaciones recibidas hoy</p>
                  <p className="text-sm mt-1">Los clientes pueden solicitar desde la página pública</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quotes.map((q) => (
                    <Link
                      key={q.id}
                      to={`/admin/quote/${q.id}`}
                      className="block border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow hover:border-brand-200"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-semibold" style={{ color: "#231F20" }}>{q.nombre}</h3>
                        {statusBadge(q.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {q.marca} {q.modelo} — {q.servicio}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(q.created_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Resumen rápido ─── */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock size={20} className="text-amber-600" />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "#231F20" }}>Resumen Rápido</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-brand-600">{appointments.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Citas hoy</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-brand-600">{quotes.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Cotizaciones hoy</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-amber-500">
                    {quotes.filter((q) => q.status === "pendiente").length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Pendientes</p>
                </div>
                <Link to="/admin/quotes" className="bg-brand-600 text-white rounded-xl p-4 hover:bg-brand-700 transition-colors">
                  <p className="text-2xl font-bold">→</p>
                  <p className="text-xs mt-1 opacity-80">Ver todas</p>
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

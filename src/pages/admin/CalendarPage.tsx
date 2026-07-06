import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { LogOut, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface Appointment {
  id: string;
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  marca: string;
  modelo: string;
  status: string;
}

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMonthAppointments();
  }, [currentMonth, currentYear]);

  const loadMonthAppointments = async () => {
    setLoading(true);
    const firstDay = new Date(currentYear, currentMonth, 1).toISOString().split("T")[0];
    const lastDay = new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0];

    const { data } = await supabase
      .from("appointments")
      .select("*")
      .gte("fecha", firstDay)
      .lte("fecha", lastDay)
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true });

    if (data) setAppointments(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const appointmentsByDay: Record<number, Appointment[]> = {};
  appointments.forEach((apt) => {
    const day = new Date(apt.fecha + "T00:00:00").getDate();
    if (!appointmentsByDay[day]) appointmentsByDay[day] = [];
    appointmentsByDay[day].push(apt);
  });

  const daysWithAppointments = new Set(Object.keys(appointmentsByDay).map(Number));

  const selectedAppointments = selectedDay ? appointmentsByDay[selectedDay] ?? [] : [];
  const today = new Date();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold">Calendario de Citas</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/quotes" className="text-gray-300 hover:text-white transition-colors text-sm">Cotizaciones</Link>
          <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-center text-gray-500 py-20">Cargando calendario...</p>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ─── Calendario ─── */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <h2 className="text-lg font-bold" style={{ color: "#231F20" }}>
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();
                const hasAppt = daysWithAppointments.has(day);
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all
                      ${isSelected ? "ring-2 ring-brand-500 bg-brand-50" : "hover:bg-gray-50"}
                      ${isToday ? "border-2 border-brand-500" : ""}
                    `}
                    style={hasAppt && !isSelected ? { backgroundColor: "#e6f7ef", color: "#006837" } : {}}
                  >
                    <span>{day}</span>
                    {hasAppt && (
                      <span className="text-[9px] mt-0.5 opacity-70">
                        {appointmentsByDay[day]?.length} cita{appointmentsByDay[day]?.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Detalle del día seleccionado ─── */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <CalendarIcon size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: "#231F20" }}>
                  {selectedDay
                    ? `${selectedDay} de ${MONTHS[currentMonth]}`
                    : "Selecciona un día"}
                </h2>
                <p className="text-xs text-gray-400">
                  {selectedDay
                    ? `${selectedAppointments.length} cita${selectedAppointments.length !== 1 ? "s" : ""}`
                    : "Haz clic en un día para ver detalles"}
                </p>
              </div>
            </div>

            {!selectedDay ? (
              <div className="text-center py-12 text-gray-400">
                <CalendarIcon size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Selecciona un día del calendario</p>
              </div>
            ) : selectedAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="font-medium">No hay citas este día</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedAppointments
                  .sort((a, b) => a.hora.localeCompare(b.hora))
                  .map((apt) => (
                    <div key={apt.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-brand-600">{apt.hora} hrs</span>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                          style={{
                            backgroundColor: apt.status === "confirmada" ? "#e6f7ef" : "#fef3c7",
                            color: apt.status === "confirmada" ? "#006837" : "#d97706",
                          }}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <h3 className="font-semibold" style={{ color: "#231F20" }}>{apt.nombre}</h3>
                      <p className="text-sm text-gray-600 mt-1">{apt.servicio}</p>
                      {(apt.marca || apt.modelo) && (
                        <p className="text-xs text-gray-400 mt-1">
                          {apt.marca} {apt.modelo}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{apt.telefono}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>
        )}
      </div>
    </div>
  );
}

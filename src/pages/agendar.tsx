import { Breadcrumbs } from "../componentes/Breadcrumb";
import { useState, useCallback, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { detectAttack } from "../lib/attackDetection";
import { detectFlood } from "../lib/attackDetection";
import { logEvent } from "../lib/logger";
import { getRequestMeta, getClientIP } from "../lib/requestMeta";

const LIMITS = { nombre: 50, telefono: 12, email: 100, placas: 8, notas: 250 };

const servicios = [
  "Reparacion de abolladuras y golpes menores",
  "Reparacion de defensas plasticas",
  "Eliminacion de oxido y reemplazo de lamina",
  "Reparacion de desprendimiento de pintura",
  "Reparacion de parrilla u otros elementos plasticos",
  "Repintado completo de vehiculos",
  "Repintado de paneles individuales",
  "Aplicacion de pintura matte, perlada y tricapa",
  "Cambio de color completo",
  "Restauracion de faros",
  "Aplicacion de texturizado en caja de Pickup",
  "Repintado de plasticos interiores",
  "Aplicacion de proteccion ceramica y selladores",
  "Trabajo de detallado y pulido de pintura",
  "Otro",
];

const horariosDisponibles = [
  "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

// Usa la fecha LOCAL del usuario (año, mes, día) en vez de toISOString(),
// que convierte a UTC y puede adelantar/atrasar el día según la zona horaria.
const todayStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Agendar() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    placas: "",
    servicio: "",
    fecha: "",
    hora: "",
    notas: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [checkingSlot, setCheckingSlot] = useState(false);
  const [occupiedHours, setOccupiedHours] = useState<string[]>([]);

  const validateInputs = (): string | null => {
    const fields = [
      { name: "nombre", value: formData.nombre },
      { name: "telefono", value: formData.telefono },
      { name: "email", value: formData.email },
      { name: "placas", value: formData.placas },
      { name: "notas", value: formData.notas },
    ];
    for (const f of fields) {
      if (f.value) {
        const result = detectAttack(f.value);
        if (result.isAttack) {
          return "Datos inválidos detectados. Por favor verifica tu información.";
        }
      }
    }
    return null;
  };

  const checkSlotAvailable = useCallback(async (fecha: string, hora: string): Promise<boolean> => {
    setCheckingSlot(true);
    const { data } = await supabase
      .from("appointments")
      .select("id")
      .eq("fecha", fecha)
      .eq("hora", hora)
      .maybeSingle();
    setCheckingSlot(false);
    return !data;
  }, []);

  useEffect(() => {
    if (!formData.fecha) {
      setOccupiedHours([]);
      return;
    }
    supabase
      .from("appointments")
      .select("hora")
      .eq("fecha", formData.fecha)
      .then(({ data }) => {
        if (data) setOccupiedHours(data.map((a) => a.hora));
      });
  }, [formData.fecha]);

  const horasDisponibles = horariosDisponibles.filter((slot) => {
    if (occupiedHours.includes(slot)) return false;
    if (formData.fecha === todayStr()) {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = slot.split(":").map(Number);
      if (sh * 60 + sm <= currentMin) return false;
    }
    return true;
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (detectAttack(value).isAttack) return;

    if (name === "telefono") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, LIMITS.telefono);
      setFormData((prev) => ({ ...prev, telefono: digitsOnly }));
      return;
    }

    if (name === "nombre" && value.length > LIMITS.nombre) return;
    if (name === "email" && value.length > LIMITS.email) return;
    if (name === "placas" && value.length > LIMITS.placas) return;
    if (name === "notas" && value.length > LIMITS.notas) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const ip = await getClientIP();
    if (detectFlood(ip).blocked) {
      setError("Demasiadas solicitudes. Espera un momento e intenta de nuevo.");
      return;
    }

    const attackError = validateInputs();
    if (attackError) {
      const meta = getRequestMeta();
      logEvent({ category: "ATTACK", severity: "WARNING", user: formData.nombre, ip, method: "POST", resource: "/agendar", statusCode: 400, message: "Intento de ataque bloqueado en formulario de citas", client: meta.client, userAgent: meta.userAgent, referer: meta.referer });
      setError(attackError);
      return;
    }

    if (formData.fecha < todayStr()) {
      setError("No puedes agendar una cita en el pasado. Selecciona una fecha a partir de hoy.");
      return;
    }

    if (formData.fecha === todayStr()) {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = formData.hora.split(":").map(Number);
      if (sh * 60 + sm <= currentMin) {
        setError("La hora seleccionada ya pasó. Elige otra hora.");
        return;
      }
    }

    const available = await checkSlotAvailable(formData.fecha, formData.hora);
    if (!available) {
      setError("Este horario ya está reservado. Por favor selecciona otra hora.");
      return;
    }

    setSending(true);

    const meta = getRequestMeta();
    const logPayload = { user: formData.nombre, ip, method: "POST" as const, resource: "/agendar" as const, statusCode: 200, client: meta.client, userAgent: meta.userAgent, referer: meta.referer };

    const { error: insertError } = await supabase.from("appointments").insert({
      nombre: formData.nombre,
      telefono: formData.telefono,
      email: formData.email || null,
      placas: formData.placas || null,
      servicio: formData.servicio,
      fecha: formData.fecha,
      hora: formData.hora,
      notas: formData.notas || null,
    });

    setSending(false);

    if (insertError) {
      logEvent({ category: "ERROR", severity: "ERROR", ...logPayload, statusCode: 500, message: `Error al agendar cita: ${insertError.message}` });
      setError("Ocurrió un error al agendar tu cita. Intenta de nuevo.");
      return;
    }

    logEvent({ category: "VISIT", severity: "INFO", ...logPayload, message: "Cita agendada exitosamente" });
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      <Breadcrumbs />

      {!submitted && (
        <div className="bg-gradient-to-br from-zinc-900 to-black text-white py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Agenda tu Cita
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#26b06b" }}>
              Reserva tu cita en minutos y evita esperas innecesarias.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {submitted ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6" style={{ color: "#006837" }}>
              ¡Cita Agendada Correctamente!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Hemos recibido tu solicitud.<br />
              Te confirmaremos por WhatsApp lo más pronto posible.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-10 py-4 text-white font-semibold rounded-2xl hover:opacity-90 transition text-lg"
              style={{ backgroundColor: "#006837" }}
            >
              Agendar Otra Cita
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-10">
            <h2 className="text-3xl font-bold mb-8" style={{ color: "#231F20" }}>
              Tus Datos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                  placeholder="Juan Pérez"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{formData.nombre.length}/{LIMITS.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                  placeholder="6441234567"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{formData.telefono.length}/{LIMITS.telefono}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                  placeholder="ejemplo@correo.com"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{formData.email.length}/{LIMITS.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placas del Auto
                </label>
                <input
                  type="text"
                  name="placas"
                  value={formData.placas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                  placeholder="ABC-1234"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{formData.placas.length}/{LIMITS.placas}</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-8" style={{ color: "#231F20" }}>
              ¿Qué servicio necesitas?
            </h2>
            <select
              name="servicio"
              value={formData.servicio}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-brand-500 mb-12"
            >
              <option value="">Selecciona un servicio...</option>
              {servicios.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <h2 className="text-3xl font-bold mb-8" style={{ color: "#231F20" }}>
              Fecha y Hora
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha deseada *
                </label>
                <input
                  type="date"
                  name="fecha"
                  required
                  value={formData.fecha}
                  onChange={handleChange}
                  min={todayStr()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora *</label>
                <select
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option value="">Selecciona una hora</option>
                  {horasDisponibles.length === 0 ? (
                    <option value="" disabled>No hay horarios disponibles</option>
                  ) : (
                    horasDisponibles.map((hora, i) => (
                      <option key={i} value={hora}>
                        {hora} hrs
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="mb-12">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas adicionales (opcional)
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-brand-500"
                placeholder="Ej: El golpe está en la puerta del conductor..."
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{formData.notas.length}/{LIMITS.notas}</p>
            </div>

            <div
              className="rounded-2xl p-6 mb-10 text-sm"
              style={{ backgroundColor: "#e6f7ef", borderColor: "#b3e6cc", borderWidth: 1 }}
            >
              <h3 className="font-semibold mb-3" style={{ color: "#231F20" }}>
                Políticas de Citas
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Te damos 15 minutos de tolerancia.</li>
                <li>• Confirmaremos tu cita por WhatsApp/Correo.</li>
                <li>• Favor de cancelar con al menos 24 horas de anticipación.</li>
                <li>• Trae tu auto limpio para un mejor servicio.</li>
              </ul>
            </div>

            {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

            <button
              type="submit"
              disabled={sending || checkingSlot}
              className="w-full py-5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {checkingSlot ? "Verificando disponibilidad..." : sending ? "Agendando..." : "Confirmar Cita"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
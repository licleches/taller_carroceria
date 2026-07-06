import { Breadcrumbs } from "../componentes/Breadcrumb";
import { useState } from "react";
import { supabase } from "../lib/supabase";

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

  const servicios = [
    { nombre: "Reparación de Carrocería", duracion: "Variable" },
    { nombre: "Repintado General", duracion: "Variable" },
    { nombre: "Restauración de Clásicos", duracion: "Variable" },
    { nombre: "Trabajos de Hojalatería", duracion: "2 horas" },
    { nombre: "Pulido y Detallado", duracion: "1.5 horas" },
    { nombre: "Evaluación y Diagnóstico", duracion: "1 hora" },
    { nombre: "Otro", duracion: "Variable" },
  ];

  const horariosDisponibles = [
    "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

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
      console.error("Error al agendar cita:", JSON.stringify(insertError));
      setError("Ocurrió un error al agendar tu cita. Intenta de nuevo.");
      return;
    }

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
                  placeholder="644 123 4567"
                />
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
                <option key={i} value={s.nombre}>
                  {s.nombre} — {s.duracion}
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
                  {horariosDisponibles.map((hora, i) => (
                    <option key={i} value={hora}>
                      {hora} hrs
                    </option>
                  ))}
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
              disabled={sending}
              className="w-full py-5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {sending ? "Agendando..." : "Confirmar Cita"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
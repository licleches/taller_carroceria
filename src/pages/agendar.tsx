import { Breadcrumbs } from "../componentes/Breadcrumb";
import { useState } from "react";

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
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cita agendada:", formData);
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50">
      <Breadcrumbs />

      {!submitted && (
        <div className="bg-gradient-to-br from-zinc-900 to-black text-white py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Agenda tu Cita
            </h1>
            <p className="text-xl text-purple-300 max-w-2xl mx-auto">
              Reserva tu cita en minutos y evita esperas innecesarias.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {submitted ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <h2 className="text-4xl font-bold text-green-600 mb-6">¡Cita Agendada Correctamente!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Hemos recibido tu solicitud.<br />
              Te confirmaremos por WhatsApp lo más pronto posible.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-10 py-4 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition text-lg"
            >
              Agendar Otra Cita
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-10">
            
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Tus Datos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500" placeholder="Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono / WhatsApp *</label>
                <input type="tel" name="telefono" required value={formData.telefono} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500" placeholder="644 123 4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500" placeholder="ejemplo@correo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placas del Auto</label>
                <input type="text" name="placas" value={formData.placas} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500" placeholder="ABC-1234" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Qué servicio necesitas?</h2>
            <select name="servicio" value={formData.servicio} onChange={handleChange} required
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-purple-500 mb-12">
              <option value="">Selecciona un servicio...</option>
              {servicios.map((s, i) => (
                <option key={i} value={s.nombre}>
                  {s.nombre} — {s.duracion}
                </option>
              ))}
            </select>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">Fecha y Hora</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha deseada *</label>
                <input type="date" name="fecha" required value={formData.fecha} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora *</label>
                <select name="hora" value={formData.hora} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500">
                  <option value="">Selecciona una hora</option>
                  {horariosDisponibles.map((hora, i) => (
                    <option key={i} value={hora}>{hora} hrs</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-12">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notas adicionales (opcional)</label>
              <textarea name="notas" value={formData.notas} onChange={handleChange} rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-purple-500"
                placeholder="Ej: El golpe está en la puerta del conductor..." />
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 mb-10 text-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Políticas de Citas</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Te damos 15 minutos de tolerancia.</li>
                <li>• Confirmaremos tu cita por WhatsApp/Correo.</li>
                <li>• Favor de cancelar con al menos 24 horas de anticipación.</li>
                <li>• Trae tu auto limpio para un mejor servicio.</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Confirmar Cita
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

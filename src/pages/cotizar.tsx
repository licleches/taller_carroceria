import { Breadcrumbs } from "../componentes/Breadcrumb";
import { useState } from "react";

export default function Cotizar() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    marca: "",
    modelo: "",
    año: "",
    servicio: "",
    descripcion: "",
    contacto: "whatsapp",
  });

  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData, file);
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50">
      <Breadcrumbs />

      {!submitted && (
        <div className="bg-gradient-to-br from-zinc-900 to-black text-white py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Solicita una Cotización
            </h1>
            <p className="text-xl text-purple-300 max-w-2xl mx-auto">
              Cuéntanos sobre tu auto y te enviaremos un presupuesto claro y sin compromiso.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {submitted ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <h2 className="text-4xl font-bold text-green-600 mb-6">¡Cotización Enviada!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Gracias {formData.nombre ? formData.nombre.split(" ")[0] : ""}.<br />
              Te contactaremos lo más pronto posible.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-10 py-4 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition text-lg"
            >
              Nueva Cotización
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500" placeholder="ejemplo@correo.com" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">Datos de tu Auto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                <input type="text" name="marca" required value={formData.marca} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500" placeholder="Ej: Toyota" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                <input type="text" name="modelo" required value={formData.modelo} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500" placeholder="Ej: Corolla" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Año *</label>
                <input type="number" name="año" required value={formData.año} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500" placeholder="Ej: 2018" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Qué necesita tu auto?</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Servicio</label>
              <select name="servicio" value={formData.servicio} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500">
                <option value="">Selecciona una opción</option>
                <option value="Carrocería">Reparación de Carrocería</option>
                <option value="Repintado">Repintado General</option>
                <option value="Restauración">Restauración de Clásicos</option>
                <option value="Hojalatería">Trabajos de Hojalatería</option>
                <option value="Detallado">Pulido y Detallado</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="mb-12">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del trabajo</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-purple-500"
                placeholder="Describe con detalle el trabajo que necesita tu auto..." required />
            </div>

            <div className="mb-12">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Subir foto o evidencia (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-3xl">📸</div>
                  <span className="text-purple-600 font-medium text-lg">Haz clic para subir una imagen</span>
                  <span className="text-gray-500 text-sm mt-1">PNG, JPG o JPEG (máximo 5MB)</span>
                </label>
              </div>
              {file && <p className="mt-3 text-green-600">✓ {file.name}</p>}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Cómo prefieres recibir el presupuesto?</h2>
            <div className="flex flex-col gap-4 mb-12">
              <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-2xl hover:bg-purple-50">
                <input type="radio" name="contacto" value="whatsapp" checked={formData.contacto === "whatsapp"} onChange={handleChange} />
                <span className="font-medium">Por WhatsApp (más rápido)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-2xl hover:bg-purple-50">
                <input type="radio" name="contacto" value="email" checked={formData.contacto === "email"} onChange={handleChange} />
                <span className="font-medium">Por Correo Electrónico</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Enviar Solicitud de Cotización
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

import { Breadcrumbs } from "../componentes/Breadcrumb";
import { useState } from "react";
import { supabase } from "../lib/supabase";

const MARCAS_POPULARES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
  "Dodge", "Ferrari", "Fiat", "Ford", "GMC", "Honda", "Hyundai", "Infiniti",
  "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Maserati",
  "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Peugeot",
  "Porsche", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo", "Otra",
];

const MODELOS_POR_MARCA: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "Highlander", "Prius", "RAV4", "Tacoma", "Tundra", "Yaris", "4Runner", "Otro"],
  Honda: ["Accord", "Civic", "CR-V", "HR-V", "Odyssey", "Pilot", "Ridgeline", "Otro"],
  Nissan: ["Altima", "Frontier", "Kicks", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Versa", "Otro"],
  Chevrolet: ["Blazer", "Colorado", "Equinox", "Malibu", "Silverado", "Suburban", "Tahoe", "Trailblazer", "Otro"],
  Ford: ["Bronco", "Edge", "Escape", "Explorer", "F-150", "Fusion", "Maverick", "Mustang", "Ranger", "Otro"],
  Volkswagen: ["Golf", "Jetta", "Passat", "Tiguan", "Touareg", "Otro"],
  BMW: ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "X1", "X3", "X5", "Otro"],
  "Mercedes-Benz": ["Clase A", "Clase C", "Clase E", "GLA", "GLC", "GLE", "Sprinter", "Otro"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "TT", "Otro"],
  Mazda: ["CX-3", "CX-5", "CX-9", "Mazda2", "Mazda3", "Mazda6", "MX-5", "Otro"],
  Hyundai: ["Accent", "Elantra", "Santa Fe", "Sonata", "Tucson", "Venue", "Otro"],
  Kia: ["Carnival", "Forte", "Niro", "Seltos", "Sorento", "Soul", "Sportage", "Telluride", "Otro"],
  Dodge: ["Challenger", "Charger", "Durango", "Ram 1500", "Otro"],
  Jeep: ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Wrangler", "Otro"],
  Subaru: ["Ascent", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "Otro"],
  Mitsubishi: ["Eclipse Cross", "Galant", "L200", "Lancer", "Montero", "Outlander", "Otro"],
  Buick: ["Enclave", "Encore", "Envision", "LaCrosse", "Otro"],
  GMC: ["Acadia", "Canyon", "Sierra", "Terrain", "Yukon", "Otro"],
  Cadillac: ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "Otro"],
  Lexus: ["ES", "GX", "IS", "LX", "NX", "RX", "UX", "Otro"],
  Infiniti: ["Q50", "Q60", "QX50", "QX60", "QX80", "Otro"],
  Acura: ["ILX", "MDX", "RDX", "TLX", "Otro"],
  Lincoln: ["Aviator", "Corsair", "Nautilus", "Navigator", "Otro"],
  Chrysler: ["300", "Pacifica", "Voyager", "Otro"],
  Ram: ["1500", "2500", "3500", "ProMaster", "Otro"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Otro"],
  Volvo: ["S60", "S90", "V60", "XC40", "XC60", "XC90", "Otro"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Otro"],
  "Land Rover": ["Defender", "Discovery", "Freelander", "Range Rover", "Otro"],
  Mini: ["Clubman", "Convertible", "Cooper", "Countryman", "Paceman", "Otro"],
  Fiat: ["500", "500L", "500X", "Tipo", "Otro"],
  Peugeot: ["2008", "208", "3008", "308", "508", "Otro"],
  Ferrari: ["296 GTB", "488", "812", "F8", "Roma", "SF90", "Otro"],
  Lamborghini: ["Aventador", "Huracán", "Urus", "Otro"],
  Maserati: ["Ghibli", "GranTurismo", "Levante", "Quattroporte", "Otro"],
  Otra: ["Otro"],
};

const currentYear = new Date().getFullYear();
const AÑOS = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear + 1 - i);

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILES = 5;

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

  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "marca") {
      setFormData({ ...formData, marca: value, modelo: "" });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const selected = Array.from(e.target.files || []);

    const invalid = selected.filter((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalid.length > 0) {
      setFileError("Solo se permiten archivos JPG o PNG.");
      e.target.value = "";
      return;
    }

    const combined = [...files, ...selected];
    if (combined.length > MAX_FILES) {
      setFileError(`Máximo ${MAX_FILES} imágenes permitidas.`);
      e.target.value = "";
      return;
    }

    setFiles(combined);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const foto_urls: string[] = [];

    if (files.length > 0) {
      for (const file of files) {
        try {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `quotes/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("evidencias")
            .upload(filePath, file);

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from("evidencias")
              .getPublicUrl(filePath);
            if (publicUrlData?.publicUrl) foto_urls.push(publicUrlData.publicUrl);
          } else {
            console.warn("Error subiendo foto (el bucket evidencias existe?):", uploadError.message);
          }
        } catch (e) {
          console.warn("Error inesperado al subir foto:", e);
        }
      }
    }

    const { error: insertError } = await supabase.from("quotes").insert({
      nombre: formData.nombre,
      telefono: formData.telefono,
      email: formData.email || null,
      marca: formData.marca,
      modelo: formData.modelo,
      año: formData.año,
      servicio: formData.servicio,
      descripcion: formData.descripcion,
      contacto: formData.contacto,
      foto_url: foto_urls.length > 0 ? foto_urls.join(",") : null,
    });

    setSending(false);

    if (insertError) {
      console.error("Error al insertar cotización:", insertError);
      const msg =
        insertError.message?.includes("duplicate key") ||
        insertError.message?.includes("violates row-level security")
          ? "Error de conexión con la base de datos. Verifica que las políticas RLS estén configuradas."
          : "Ocurrió un error al enviar tu cotización. Intenta de nuevo.";
      setError(msg);
      return;
    }

    setSubmitted(true);
  };

  const modelosDisponibles = formData.marca ? (MODELOS_POR_MARCA[formData.marca] ?? ["Otro"]) : [];

  return (
    <div className="bg-white">
      <Breadcrumbs />

      {!submitted && (
        <div className="bg-gradient-to-br from-zinc-900 to-black text-white py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Solicita una Cotización
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#26b06b" }}>
              Cuéntanos sobre tu auto y te enviaremos un presupuesto claro y sin compromiso.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {submitted ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#006837" }}>
              ¡Cotización Recibida!
            </h2>
            <p className="text-xl text-gray-600 mb-3">
              Gracias {formData.nombre.split(" ")[0]}, hemos recibido tu solicitud correctamente.
            </p>
            <p className="text-gray-500 mb-2">
              Nuestro equipo revisará los detalles de tu{" "}
              <span className="font-medium">{formData.marca} {formData.modelo}</span> y te
              contactará en un plazo aproximado de <span className="font-medium">24 horas</span>.
            </p>
            <p className="text-gray-400 text-sm mb-10">
              Te responderemos por {formData.contacto === "whatsapp" ? "WhatsApp" : "Correo Electrónico"}.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  nombre: "", telefono: "", email: "", marca: "", modelo: "",
                  año: "", servicio: "", descripcion: "", contacto: "whatsapp",
                });
                setFiles([]);
              }}
              className="px-10 py-4 text-white font-semibold rounded-2xl hover:opacity-90 transition text-lg"
              style={{ backgroundColor: "#006837" }}
            >
              Nueva Cotización
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-10">

            {/* ── DATOS PERSONALES ── */}
            <h2 className="text-3xl font-bold mb-8" style={{ color: "#231F20" }}>Tus Datos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  maxLength={50}
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                  placeholder="Juan Pérez"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formData.nombre.length}/50
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  required
                  maxLength={12}
                  value={formData.telefono}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9\-]/g, "");
                    setFormData({ ...formData, telefono: val });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                  placeholder="6441234567"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formData.telefono.length}/12
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  maxLength={100}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                  placeholder="ejemplo@correo.com"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formData.email.length}/100
                </p>
              </div>
            </div>

            {/* ── DATOS DEL AUTO ── */}
            <h2 className="text-3xl font-bold mb-8" style={{ color: "#231F20" }}>Datos de tu Auto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                <select
                  name="marca"
                  required
                  value={formData.marca}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option value="">Selecciona una marca</option>
                  {MARCAS_POPULARES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                <select
                  name="modelo"
                  required
                  value={formData.modelo}
                  onChange={handleChange}
                  disabled={!formData.marca}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.marca ? "Selecciona un modelo" : "Primero selecciona marca"}
                  </option>
                  {modelosDisponibles.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Año *</label>
                <select
                  name="año"
                  required
                  value={formData.año}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option value="">Selecciona el año</option>
                  {AÑOS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── SERVICIO ── */}
            <h2 className="text-3xl font-bold mb-8" style={{ color: "#231F20" }}>
              ¿Qué necesita tu auto?
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Servicio *
              </label>
              <select
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
              >
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del trabajo *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    setFormData({ ...formData, descripcion: e.target.value });
                  }
                }}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-brand-500"
                placeholder="Describe con detalle el trabajo que necesita tu auto..."
                required
              />
              <p className={`text-xs mt-1 text-right ${formData.descripcion.length >= 240 ? "text-orange-500" : "text-gray-400"}`}>
                {formData.descripcion.length}/250
              </p>
            </div>

            {/* ── IMÁGENES ── */}
            <div className="mb-12">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fotos o evidencia — hasta {MAX_FILES} imágenes (opcional)
              </label>

              {files.length < MAX_FILES && (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-brand-400 transition-colors mb-4">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl"
                      style={{ backgroundColor: "#e6f7ef" }}
                    >
                      📸
                    </div>
                    <span className="font-medium text-lg" style={{ color: "#006837" }}>
                      Haz clic para agregar imágenes
                    </span>
                    <span className="text-gray-500 text-sm mt-1">
                      Solo JPG o PNG · Máximo {MAX_FILES} imágenes
                    </span>
                  </label>
                </div>
              )}

              {fileError && (
                <p className="text-red-500 text-sm mb-3">⚠ {fileError}</p>
              )}

              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <span className="text-sm text-gray-700 truncate max-w-xs">✓ {f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-red-400 hover:text-red-600 text-sm ml-4 flex-shrink-0"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {files.length > 0 && (
                <p className="text-xs text-gray-400 mt-2 text-right">
                  {files.length}/{MAX_FILES} imágenes seleccionadas
                </p>
              )}
            </div>

            {/* ── PREFERENCIA CONTACTO ── */}
            <h2 className="text-3xl font-bold mb-6" style={{ color: "#231F20" }}>
              ¿Cómo prefieres recibir el presupuesto?
            </h2>
            <div className="flex flex-col gap-4 mb-12">
              <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-2xl hover:bg-brand-50">
                <input
                  type="radio"
                  name="contacto"
                  value="whatsapp"
                  checked={formData.contacto === "whatsapp"}
                  onChange={handleChange}
                />
                <span className="font-medium">Por WhatsApp (más rápido)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-2xl hover:bg-brand-50">
                <input
                  type="radio"
                  name="contacto"
                  value="email"
                  checked={formData.contacto === "email"}
                  onChange={handleChange}
                />
                <span className="font-medium">Por Correo Electrónico</span>
              </label>
            </div>

            {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Enviar Solicitud de Cotización"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
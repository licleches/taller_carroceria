import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Download, LogOut, Image, FileText, Upload } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Toast from "../../componentes/Toast";

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
  descripcion: string;
  contacto: string;
  status: string;
  foto_url: string | null;
  respuesta_precio: string | null;
  respuesta_tiempo: string | null;
  respuesta_notas: string | null;
  respuesta_pdf_url: string | null;
  responded_at: string | null;
}

const STATUS_OPTIONS = [
  { value: "pendiente",  label: "Pendiente",  color: "#d97706", bg: "#fef3c7" },
  { value: "revisado",   label: "Revisado",   color: "#2563eb", bg: "#dbeafe" },
  { value: "respondida", label: "Respondida", color: "#006837", bg: "#e6f7ef" },
  { value: "cancelada",  label: "Cancelada",  color: "#dc2626", bg: "#fee2e2" },
];

export default function QuoteDetail() {
  const { id } = useParams();
  const [quote, setQuote]       = useState<Quote | null>(null);
  const [precio, setPrecio]     = useState("");
  const [tiempo, setTiempo]     = useState("");
  const [notas, setNotas]       = useState("");
  const [status, setStatus]     = useState("pendiente");
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [fotos, setFotos]       = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl]     = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (id) loadQuote(); }, [id]);

  const loadQuote = async () => {
    const { data } = await supabase.from("quotes").select("*").eq("id", id).single();
    if (data) {
      setQuote(data);
      setPrecio(data.respuesta_precio ?? "");
      setTiempo(data.respuesta_tiempo ?? "");
      setNotas(data.respuesta_notas ?? "");
      setStatus(data.status ?? "pendiente");
      setFotos(data.foto_url ? data.foto_url.split(",").filter(Boolean) : []);
      setPdfUrl(data.respuesta_pdf_url ?? null);
    }
  };

  const ALLOWED_FILE_TYPES = ["application/pdf", "text/csv", "application/vnd.ms-excel"];
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ALLOWED_FILE_TYPES.includes(file.type)) {
      setToast({ message: "Solo se permiten archivos PDF o CSV.", type: "error" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setToast({ message: "El archivo no debe superar los 10 MB.", type: "error" });
      return;
    }

    setUploadingPdf(true);
    const ext = file.name.split(".").pop() || "pdf";
    const fileName = `respuestas/${id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("evidencias")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Error subiendo PDF:", uploadError);
      setToast({ message: "Error al subir el PDF. Intenta de nuevo.", type: "error" });
      setUploadingPdf(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("evidencias")
      .getPublicUrl(fileName);

    if (publicUrlData?.publicUrl) {
      setPdfUrl(publicUrlData.publicUrl);
      setToast({ message: "PDF subido correctamente.", type: "success" });
    }
    setUploadingPdf(false);
    if (e.target) e.target.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    const updates: Record<string, unknown> = {
      respuesta_precio: precio || null,
      respuesta_tiempo: tiempo || null,
      respuesta_notas:  notas  || null,
      status,
    };
    if (pdfUrl) updates.respuesta_pdf_url = pdfUrl;
    if (status === "respondida") updates.responded_at = new Date().toISOString();

    const { error } = await supabase
      .from("quotes")
      .update(updates)
      .eq("id", id);

    setSaving(false);
    if (!error) {
      setToast({ message: "Cotización respondida correctamente.", type: "success" });
      setTimeout(() => navigate("/admin/quotes"), 1500);
    } else {
      console.error("Error al guardar respuesta:", error);
      setToast({ message: "Ocurrió un error al guardar la respuesta. Intente nuevamente.", type: "error" });
    }
  };

  const generatePDF = () => {
    if (!quote) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 104, 55);
    doc.text("Desert Jewel Bodyshop", 105, 25, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Cotización Personalizada", 105, 33, { align: "center" });
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-MX")}`, 105, 39, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(35, 31, 32);
    doc.text("Datos del Cliente", 14, 52);
    autoTable(doc, {
      startY: 56,
      head: [["Campo", "Valor"]],
      body: [
        ["Nombre", quote.nombre],
        ["Teléfono", quote.telefono],
        ["Email", quote.email || "—"],
        ["Marca", quote.marca],
        ["Modelo", quote.modelo],
        ["Año", quote.año],
        ["Servicio", quote.servicio],
        ["Descripción", quote.descripcion],
        ["Contacto prefiere", quote.contacto === "whatsapp" ? "WhatsApp" : "Correo"],
      ],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 104, 55] },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 120 } },
    });
    let y = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(35, 31, 32);
    doc.text("Respuesta del Taller", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [["Concepto", "Detalle"]],
      body: [
        ["Precio estimado",   quote.respuesta_precio || "—"],
        ["Tiempo estimado",   quote.respuesta_tiempo || "—"],
        ["Notas adicionales", quote.respuesta_notas  || "—"],
      ],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 104, 55] },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 120 } },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    if (quote.respuesta_pdf_url) {
      doc.setFontSize(10);
      doc.setTextColor(0, 104, 55);
      doc.text("Se adjuntó un archivo PDF adicional con el detalle de la cotización.", 14, y);
    }

    doc.save(`cotizacion-${quote.nombre.replace(/\s+/g, "_")}.pdf`);
  };

  const handleLogout = async () => { await logout(); navigate("/admin/login"); };

  const savedStatus = STATUS_OPTIONS.find((s) => s.value === quote?.status) ?? STATUS_OPTIONS[0];

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando cotización...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Evidencia" className="max-w-full max-h-full rounded-2xl object-contain" />
          <button className="absolute top-4 right-6 text-white text-3xl font-bold" onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}

      <header className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/quotes" className="text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold">Cotización #{quote.id.slice(0, 8)}</h1>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
            style={{ backgroundColor: savedStatus.bg, color: savedStatus.color }}
          >
            {savedStatus.label}
          </span>
        </div>
        <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors">
          <LogOut size={18} />
        </button>
      </header>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* ── Datos del cliente ── */}
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#231F20" }}>Datos del Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {([
              ["Nombre",       quote.nombre],
              ["Teléfono",     quote.telefono],
              ["Email",        quote.email || "—"],
              ["Marca",        quote.marca],
              ["Modelo",       quote.modelo],
              ["Año",          quote.año],
              ["Servicio",     quote.servicio],
              ["Contacto vía", quote.contacto === "whatsapp" ? "WhatsApp" : "Correo"],
              ["Recibida",     new Date(quote.created_at).toLocaleDateString("es-MX", {
                year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
              })],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label}>
                <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
                <p className="font-medium mt-0.5" style={{ color: "#231F20" }}>{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Descripción del trabajo</span>
            <p className="mt-1 text-gray-800">{quote.descripcion}</p>
          </div>
        </div>

        {/* ── Fotos ── */}
        {fotos.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2" style={{ color: "#231F20" }}>
              <Image size={22} /> Fotos del cliente
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {fotos.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(url)}
                  className="aspect-square rounded-xl overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
                >
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Responder / editar ── */}
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#231F20" }}>
            {quote.respuesta_precio || quote.respuesta_tiempo || quote.respuesta_notas || quote.respuesta_pdf_url
              ? "Editar Respuesta"
              : "Responder Cotización"}
          </h2>

          <div className="space-y-5">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <div className="flex flex-wrap gap-3">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className="px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all"
                    style={
                      status === opt.value
                        ? { backgroundColor: opt.bg, color: opt.color, borderColor: opt.color }
                        : { backgroundColor: "white", color: "#6b7280", borderColor: "#e5e7eb" }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio estimado</label>
              <input
                type="text"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                placeholder="$ 0.00 MXN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo estimado</label>
              <input
                type="text"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-500"
                placeholder="Ej: 3 días hábiles"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notas adicionales</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-brand-500"
                placeholder="Incluye cualquier detalle relevante..."
              />
            </div>

            {/* ── Subir PDF/CSV ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adjuntar archivo (PDF o CSV con cotización desde Excel)
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,.csv,application/pdf,text/csv,application/vnd.ms-excel"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={uploadingPdf}
                  className="px-5 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Upload size={16} />
                  {uploadingPdf ? "Subiendo..." : "Seleccionar archivo"}
                </button>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-green-50 text-brand-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-all flex items-center gap-2 border border-green-200"
                  >
                    <FileText size={16} /> Ver archivo adjunto
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Máximo 10 MB · PDF o CSV</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-4 text-white font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
                style={{ background: "linear-gradient(to right, #005a2e, #006837)" }}
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                onClick={generatePDF}
                className="px-8 py-4 border-2 font-semibold rounded-2xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2"
                style={{ borderColor: "#006837", color: "#006837" }}
              >
                <Download size={18} /> Descargar PDF
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

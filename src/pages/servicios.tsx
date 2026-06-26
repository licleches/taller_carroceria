import { Breadcrumbs } from "../componentes/Breadcrumb";
import { Link } from "react-router-dom";

export default function Servicios() {
  return (
    <div className="bg-gray-50">
      <Breadcrumbs />

      <div className="bg-gradient-to-br from-zinc-900 to-black text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-purple-300 max-w-2xl mx-auto">
            Reparación de carrocería, repintado general y restauración de autos clásicos. 
            Calidad y durabilidad en cada trabajo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Reparación de Carrocería
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Reparación de abolladuras y golpes",
              "Alineación y enderezado de paneles",
              "Reparación de defensas y fascias",
              "Soldadura de lámina y fibra de vidrio",
              "Eliminación de óxido y corrosión",
              "Preparación de superficies para pintura"
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all">
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Repintado General
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Repintado completo de vehículos",
              "Pintura de paneles individuales",
              "Aplicación de pintura de alto rendimiento",
              "Acabados mate, brillante y perlado",
              "Trabajos de detallado y pulido",
              "Protección cerámica y selladores"
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all">
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Restauración de Autos Clásicos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Restauraciones completas de autos antiguos",
              "Rescate de vehículos con valor sentimental",
              "Reemplazo de paneles y secciones completas",
              "Pintura color original y acabados de época",
              "Trabajo detallado en interiores y exteriores",
              "Preservación de autenticidad y valor histórico"
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all border border-purple-100 hover:border-purple-300">
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Servicios Adicionales
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Diagnóstico y evaluación de daños",
              "Trabajos menores de hojalatería",
              "Aplicación de anticorrosivos",
              "Pulido y detallado profesional",
              "Personalización de color a elección",
              "Asesoría en mantenimiento de pintura"
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all">
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="bg-zinc-900 py-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          ¿Necesitas nuestros servicios?
        </h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          Cotiza tu servicio sin compromiso y agenda tu cita.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/cotizar"
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:scale-105 transition-all"
          >
            Cotizar Ahora
          </Link>
          <Link
            to="/agendar"
            className="inline-block px-10 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-black transition-all"
          >
            Agendar Cita
          </Link>
        </div>
      </div>
    </div>
  );
}

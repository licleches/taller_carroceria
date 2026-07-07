import { Breadcrumbs } from "../componentes/Breadcrumb";
import { Link } from "react-router-dom";

const CATEGORIES = [
  {
    title: "Reparación de Carrocería",
    items: [
      "Reparacion de abolladuras y golpes menores",
      "Reparacion de defensas plasticas",
      "Eliminacion de oxido y reemplazo de lamina",
      "Reparacion de desprendimiento de pintura",
      "Reparacion de parrilla u otros elementos plasticos",
    ],
  },
  {
    title: "Repintado General",
    items: [
      "Repintado completo de vehiculos",
      "Repintado de paneles individuales",
      "Aplicacion de pintura matte, perlada y tricapa",
      "Cambio de color completo",
    ],
  },
  {
    title: "Servicios Adicionales",
    items: [
      "Restauracion de faros",
      "Aplicacion de texturizado en caja de Pickup",
      "Repintado de plasticos interiores",
      "Aplicacion de proteccion ceramica y selladores",
      "Trabajo de detallado y pulido de pintura",
    ],
  },
];

export default function Servicios() {
  return (
    <div className="bg-white">
      <Breadcrumbs />

      <div className="bg-gradient-to-br from-zinc-900 to-black text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Nuestros Servicios
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "#26b06b" }}>
            Reparación de carrocería, repintado general y servicios especializados.
            Calidad y durabilidad en cada trabajo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {CATEGORIES.map((cat, ci) => (
          <div key={ci} className={ci < CATEGORIES.length - 1 ? "mb-20" : ""}>
            <h2 className="text-4xl font-bold mb-8" style={{ color: "#231F20" }}>
              {cat.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all border border-gray-100"
                >
                  <p className="font-medium" style={{ color: "#231F20" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="py-16 text-center" style={{ backgroundColor: "#231F20" }}>
        <h2 className="text-4xl font-bold text-white mb-6">
          ¿Necesitas nuestros servicios?
        </h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          Cotiza tu servicio sin compromiso y agenda tu cita.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/cotizar"
            className="inline-block px-10 py-4 bg-gradient-to-r from-brand-600 to-brand-500 rounded-xl font-semibold text-white hover:scale-105 transition-all"
          >
            Cotizar Ahora
          </Link>
          <Link
            to="/agendar"
            className="inline-block px-10 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-zinc-900 transition-all"
          >
            Agendar Cita
          </Link>
        </div>
      </div>
    </div>
  );
}

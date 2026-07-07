import { Link } from "react-router-dom";
import { Wrench, Paintbrush, Sparkles, Shield, Clock, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════ */}
      {/* HERO */}
      {/* ════════════════════════════════════════ */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_50%,#006837_0%,transparent_70%)] opacity-25"></div>
        <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/5 rounded-full"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Desert Jewel<span className="text-brand-400"> Bodyshop</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Reparación de carrocería, repintado general y servicios especializados.
            <span className="block text-brand-400 font-semibold mt-2">La calidad es nuestro principal compromiso.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/cotizar"
              className="group px-10 py-5 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl font-semibold text-lg text-white hover:scale-105 transition-all duration-300 shadow-2xl shadow-brand-600/40 flex items-center gap-3"
            >
              <Wrench size={20} />
              Cotizar Ahora
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/agendar"
              className="px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-zinc-900 hover:border-white transition-all duration-300 flex items-center gap-3"
            >
              <Clock size={20} />
              Agendar Cita
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* BIENVENIDA */}
      {/* ════════════════════════════════════════ */}
      <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent"></div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "#231F20" }}>
          Bienvenido a Desert Jewel Bodyshop
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Nos enfocamos principalmente en la calidad de los trabajos, más que en la rapidez.
          Nuestro objetivo es entregar trabajos duraderos con una excelente terminación.
        </p>

      </div>

      {/* ════════════════════════════════════════ */}
      {/* SERVICIOS DESTACADOS */}
      {/* ════════════════════════════════════════ */}
      <div className="py-24" style={{ backgroundColor: "#e6f7ef" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#231F20" }}>
              Nuestros Servicios
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Desde reparaciones menores hasta repintados completos, tenemos todo lo que tu auto necesita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Reparación de Carrocería",
                desc: "Abolladuras, golpes, defensas, óxido y más. Recuperamos la forma original de tu auto.",
                icon: Wrench,
                color: "#d97706",
                bg: "#fef3c7",
              },
              {
                title: "Repintado General",
                desc: "Pintura mate, perlada, tricapa o cambio de color completo. Acabados de exhibición.",
                icon: Paintbrush,
                color: "#006837",
                bg: "#e6f7ef",
              },
              {
                title: "Servicios Adicionales",
                desc: "Restauración de faros, protección cerámica, texturizado de Pickup y detallado profesional.",
                icon: Shield,
                color: "#2563eb",
                bg: "#dbeafe",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-brand-200"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: service.bg }}
                >
                  <service.icon size={32} style={{ color: service.color }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: "#231F20" }}>{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                <Link
                  to="/servicios"
                  className="inline-flex items-center gap-2 mt-6 text-sm font-semibold hover:gap-3 transition-all"
                  style={{ color: "#006837" }}
                >
                  Ver detalles →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* EXPLORA */}
      {/* ════════════════════════════════════════ */}
      <div className="bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#231F20" }}>
              Explora Desert Jewel Bodyshop
            </h2>
            <p className="text-gray-600 text-lg">Descubre todo lo que tenemos para ti</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { to: "/nosotros", title: "Nosotros", desc: "Conoce nuestra historia", icon: Star },
              { to: "/servicios", title: "Servicios", desc: "Ver todos los servicios", icon: Paintbrush },
              { to: "/cotizar", title: "Cotizar", desc: "Solicita presupuesto", icon: Wrench },
              { to: "/agendar", title: "Agendar Cita", desc: "Reserva tu cita", icon: Clock },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="group bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all hover:-translate-y-2 text-center border border-transparent hover:border-brand-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "#e6f7ef" }}
                >
                  <item.icon size={28} style={{ color: "#006837" }} />
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ color: "#231F20" }}>{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* CTA FINAL */}
      {/* ════════════════════════════════════════ */}
      <div className="relative py-28 text-center overflow-hidden" style={{ backgroundColor: "#231F20" }}>
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_50%,#006837_0%,transparent_70%)] opacity-20"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border border-white/5 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-white/5 rounded-full"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            ¿Listo para darle una nueva vida a tu auto?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Cotiza hoy sin compromiso y descubre la calidad que nos distingue.
          </p>
          <Link
            to="/cotizar"
            className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-xl rounded-3xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-brand-600/40"
          >
            <Wrench size={22} />
            SOLICITAR COTIZACIÓN GRATIS
          </Link>
        </div>
      </div>

    </div>
  );
}

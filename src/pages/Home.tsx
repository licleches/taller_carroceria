import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wrench, Paintbrush, Shield, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = [
  "/images/faros.webp",
  "/images/faros2.webp",
  "/images/faros3.webp",
  "/images/faros4.webp",
  "/images/carro1.jpeg",
  "/images/carro3.png",
];

const workVideos = [
  "/images/video1.mp4",
  "/images/video2.mp4",
  "/images/video3.mp4",
  "/images/video4.mp4",
  "/images/video5.mp4",
  "/images/video6.mp4",
  "/images/video7.mp4",
  "/images/video8.mp4",
  "/images/video9.mp4",
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════ */}
      {/* HERO CAROUSEL */}
      {/* ════════════════════════════════════════ */}
      <div
        className="relative h-screen overflow-hidden bg-black"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {carouselImages.map((src, i) => (
            <div key={i} className="min-w-full h-full relative flex-shrink-0">
              <img
                src={src}
                alt={`Trabajo ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="relative z-10 text-left px-6 md:pl-32 md:pr-16 max-w-4xl">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border"
                 style={{ color: "#26b06b", borderColor: "rgba(38,176,107,0.3)", backgroundColor: "rgba(38,176,107,0.08)" }}>
              Taller de Carrocería y Pintura
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              Desert Jewel<span className="block text-4xl md:text-5xl font-light mt-2" style={{ color: "#26b06b" }}>Bodyshop</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Reparación de carrocería, repintado general y servicios especializados.
              <span className="block font-semibold mt-1" style={{ color: "#26b06b" }}>La calidad es nuestro principal compromiso.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/cotizar"
                className="group px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300 shadow-2xl shadow-brand-600/40 flex items-center gap-3"
              >
                <Wrench size={18} />
                Cotizar Ahora
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/agendar"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold hover:bg-white hover:text-zinc-900 hover:border-white transition-all duration-300 flex items-center gap-3"
              >
                <Clock size={18} />
                Agendar Cita
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrent((c) => (c - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all opacity-60 hover:opacity-100 z-30"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrent((c) => (c + 1) % carouselImages.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all opacity-60 hover:opacity-100 z-30"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-10" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              style={i === current ? { backgroundColor: "#26b06b", width: "2.5rem" } : {}}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 right-8 z-20 text-white/40 text-xs font-mono tracking-wider">
          {String(current + 1).padStart(2, "0")} / {String(carouselImages.length).padStart(2, "0")}
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
      {/* TRABAJOS */}
      {/* ════════════════════════════════════════ */}
      <div className="py-28 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 border"
                 style={{ color: "#26b06b", borderColor: "rgba(38,176,107,0.3)", backgroundColor: "rgba(38,176,107,0.08)" }}>
              Portafolio
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Nuestros Trabajos
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Mira algunos de los trabajos que hemos realizado. Cada proyecto es tratado con el máximo cuidado y atención al detalle.
            </p>
          </div>

          <div className="flex flex-col gap-10 md:gap-16">
            {workVideos.map((src, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="w-full md:w-5/12 lg:w-1/3 max-w-md">
                  <div className="group relative rounded-2xl overflow-hidden border border-zinc-700/50 bg-zinc-800/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div className="p-2">
                      <div className="rounded-lg overflow-hidden bg-black">
                        <video
                          src={src}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
                  </div>
                </div>
                <div className="hidden md:flex flex-1 items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-brand-500/30" />
                    <span className="text-xs font-mono tracking-widest text-zinc-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

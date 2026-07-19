import { Link } from "react-router-dom";
import { Wrench, Clock } from "lucide-react";
import { Breadcrumbs } from "../componentes/Breadcrumb";

export default function Nosotros() {
  return (
    <div className="bg-white">
      <Breadcrumbs />

      <div className="relative h-[75vh] min-h-[500px] overflow-hidden bg-black">
        <img
          src="/images/taller.jpg"
          alt="Taller Desert Jewel Bodyshop"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

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
              Nos enfocamos en la calidad de los trabajos, más que en la rapidez.
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
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6" style={{ color: "#231F20" }}>Nuestra Historia</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Desert Jewel Bodyshop nació en 2023 gracias a la visión de Cesar Alonso Serrano Lopez 
              y su socio Diego. Lo que comenzó como un hobbie por la reparación de carrocería se 
              convirtió en la decisión de emprender y ofrecer servicios de calidad a la comunidad.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nos especializamos en reparación de carrocería, repintado general y restauración
              de autos clásicos. Cada proyecto es tratado con el máximo cuidado y atención al detalle.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <img 
                src="/images/taller.jpg"         
                alt="Taller Desert Jewel Bodyshop"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                 style={{ backgroundColor: "#006837" }}>
              <span className="text-white text-3xl font-bold">+2</span>
            </div>
            <div className="absolute -top-5 -right-5 w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-gray-100">
              <span className="text-3xl font-bold" style={{ color: "#006837" }}>2023</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20" style={{ backgroundColor: "#e6f7ef" }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: "#231F20" }}>
            ¿Por qué elegir Desert Jewel Bodyshop?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Calidad ante todo", desc: "Nos enfocamos en la calidad más que en la rapidez. Entregamos trabajos duraderos con excelente terminación." },
              { title: "Compromiso sentimental", desc: "Entendemos que tu auto no es solo un medio de transporte, es parte de tus experiencias y recuerdos más importantes." },
              { title: "Confianza y transparencia", desc: "Presupuestos claros, sin sorpresas. Te explicamos cada paso del proceso." }
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-white border border-brand-100">
                <h3 className="text-2xl font-semibold mb-3" style={{ color: "#231F20" }}>{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: "#231F20" }}>Nuestro Equipo</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Actualmente el taller es operado personalmente por Cesar, quien se encarga de cada trabajo 
            con dedicación y atención al detalle.
          </p>
          
          <div className="grid md:grid-cols-1 max-w-md mx-auto gap-8">
            {[
              { 
                name: "Cesar Alonso Serrano Lopez", 
                role: "Carrocero y Especialista en Repintado", 
                experience: "+3 años de experiencia",
                img: "/images/cesar.jpeg"     
              },
            ].map((member, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow max-w-sm mx-auto border border-brand-100">
                <img 
                  src={member.img}
                  alt={member.name}
                  className="w-full h-72 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-xl" style={{ color: "#231F20" }}>{member.name}</h3>
                  <p style={{ color: "#006837" }}>{member.role}</p>
                  <p className="text-sm text-gray-500 mt-2">{member.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-12" style={{ color: "#231F20" }}>Visítanos</h2>
        
        <div className="max-w-md mx-auto space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4" style={{ color: "#231F20" }}>Ubicación</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              San Luis Río Colorado, Sonora, México
            </p>
            <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0" style={{ color: "#006837" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Frente a la clínica 53 del IMSS, Av. Nuevo León
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4" style={{ color: "#231F20" }}>Horario</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Lunes a Viernes: 10:00 am - 6:00 pm<br />
              Sábado: 9:00 am - 2:00 pm
            </p>
          </div>
          <div>
            <a
              href="https://instagram.com/desert_jewel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium hover:opacity-80 transition-colors text-lg"
              style={{ color: "#006837" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Síguenos en @desert_jewel
            </a>
          </div>
        </div>
      </div>

      <div className="py-20 text-center" style={{ backgroundColor: "#231F20" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-6">
            Mensaje de Cesar
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            "La calidad es nuestro principal objetivo. Sabemos que para ustedes su auto no es solo 
            un medio de transporte, es un lugar donde han vivido experiencias, historias y momentos 
            importantes. Por eso queremos darles el mejor servicio."
          </p>
        </div>
      </div>
    </div>
  );
}

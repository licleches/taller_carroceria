import { Breadcrumbs } from "../componentes/Breadcrumb";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white">
      <Breadcrumbs />

      <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#006837_0%,transparent_70%)] opacity-30"></div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Desert Jewel<span className="text-brand-400"> Bodyshop</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-200 mb-12 max-w-3xl mx-auto leading-tight">
            Especialistas en reparación de carrocería y repintado general.<br />
            La calidad es nuestro principal compromiso.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              to="/cotizar"
              className="px-12 py-5 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl font-semibold text-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-brand-600/50 text-white"
            >
              Cotizar Ahora
            </Link>
            <Link 
              to="/agendar"
              className="px-12 py-5 border-2 border-white text-white rounded-2xl font-semibold text-xl hover:bg-white hover:text-zinc-900 transition-all duration-300"
            >
              Agendar Cita
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 animate-bounce text-4xl">
          ↓
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6" style={{ color: "#231F20" }}>
          Bienvenido a Desert Jewel Bodyshop
        </h2>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          En Desert Jewel Bodyshop nos enfocamos principalmente en la calidad de los trabajos, 
          más que en la rapidez. Nuestro objetivo es entregar trabajos duraderos con una excelente 
          terminación. Sabemos que tu auto no es solo un medio de transporte, es un lugar donde has 
          vivido experiencias, historias y momentos importantes.
        </p>
      </div>

      <div className="py-20" style={{ backgroundColor: "#e6f7ef" }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: "#231F20" }}>
            Nuestros Servicios Principales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Reparación de Carrocería", 
                desc: "Reparaciones leves de carrocería, abolladuras, golpes y alineación de paneles.", 
                img: "/images/body1.jpg"     
              },
              { 
                title: "Repintado General", 
                desc: "Aplicación de pintura de alto rendimiento. Acabados duraderos con excelente terminación.", 
                img: "/images/body2.jpg"              
              },
              { 
                title: "Restauración de Clásicos", 
                desc: "Restauraciones completas de autos antiguos, devolviéndoles su valor sentimental y original.", 
                img: "/images/body3.jpg"         
              }
            ].map((service, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-brand-100">
                <img 
                  src={service.img} 
                  alt={service.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-3" style={{ color: "#231F20" }}>{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#231F20" }}>
            Explora Desert Jewel Bodyshop
          </h2>
          <p className="text-gray-600 mb-12 text-lg">Descubre todo lo que tenemos para ti</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/nosotros" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-transparent hover:border-brand-300">
              <h3 className="font-semibold text-xl mb-2" style={{ color: "#231F20" }}>Nosotros</h3>
              <p className="text-gray-500 text-sm">Conoce nuestra historia</p>
            </Link>

            <Link to="/servicios" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-transparent hover:border-brand-300">
              <h3 className="font-semibold text-xl mb-2" style={{ color: "#231F20" }}>Servicios</h3>
              <p className="text-gray-500 text-sm">Ver todos los servicios</p>
            </Link>

            <Link to="/cotizar" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-transparent hover:border-brand-300">
              <h3 className="font-semibold text-xl mb-2" style={{ color: "#231F20" }}>Cotizar</h3>
              <p className="text-gray-500 text-sm">Solicita presupuesto</p>
            </Link>

            <Link to="/agendar" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-transparent hover:border-brand-300">
              <h3 className="font-semibold text-xl mb-2" style={{ color: "#231F20" }}>Agendar Cita</h3>
              <p className="text-gray-500 text-sm">Reserva tu cita</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-24 text-center" style={{ backgroundColor: "#231F20" }}>
        <h2 className="text-5xl font-bold mb-6 text-white">
          ¿Listo para darle una nueva vida a tu auto?
        </h2>
        <Link 
          to="/cotizar"
          className="inline-block px-14 py-6 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-2xl rounded-3xl hover:scale-105 transition-all duration-300 shadow-2xl"
        >
          SOLICITAR COTIZACIÓN GRATIS
        </Link>
      </div>
    </div>
  );
}

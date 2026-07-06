import { Breadcrumbs } from "../componentes/Breadcrumb";

export default function Nosotros() {
  return (
    <div className="bg-white">
      <Breadcrumbs />

      <div className="bg-gradient-to-br from-zinc-900 to-black text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Sobre Desert Jewel Bodyshop
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "#26b06b" }}>
            Nos enfocamos en la calidad de los trabajos, más que en la rapidez.
          </p>
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
              Desde entonces nos hemos dedicado a la reparación de carrocería, repintado general y 
              restauración de autos clásicos. Últimamente hemos realizado varias restauraciones 
              completas de autos antiguos, algo que nos llena de orgullo por la confianza que nuestros 
              clientes depositan en nosotros al dejarnos sus vehículos con gran valor sentimental.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="/images/taller.jpg"         
              alt="Taller Desert Jewel Bodyshop"
              className="w-full h-full object-cover"
            />
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
                img: "/images/kim.jpeg"     
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

      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: "#231F20" }}>Visítanos</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4" style={{ color: "#231F20" }}>Ubicación</h3>
            <p className="text-gray-600 mb-6">
              Cjon Zaragoza y 27, Colonia Burócrata<br />
              Hermosillo, Sonora, México
            </p>
            <p className="text-gray-600 mb-6">
              Horario:<br />
              Lunes a Viernes: 10:00 am - 6:00 pm<br />
              Sábado: 9:00 am - 2:00 pm
            </p>
            <a
              href="https://instagram.com/desert_jewel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium hover:opacity-80 transition-colors"
              style={{ color: "#006837" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Síguenos en @desert_jewel
            </a>
          </div>

          <div className="bg-gray-200 rounded-2xl h-80 flex items-center justify-center border">
            <p className="text-gray-500 text-center">
              Aquí irá el mapa de Google Maps
            </p>
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

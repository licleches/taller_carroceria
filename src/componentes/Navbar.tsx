import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-800/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/public/images/logodj.png"
              alt="Desert Jewel Bodyshop"
              className="h-10 w-auto hidden sm:block"
            />
            <span className="text-white font-bold text-xl tracking-tight">
              Desert Jewel<span className="text-brand-400"> Bodyshop</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Inicio</Link>
            <Link to="/servicios" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Servicios</Link>
            <Link to="/cotizar" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Cotizar</Link>
            <Link to="/agendar" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Agendar Cita</Link>
            <Link to="/nosotros" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Nosotros</Link>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

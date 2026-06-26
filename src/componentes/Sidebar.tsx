import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/cotizar", label: "Cotizar" },
  { to: "/agendar", label: "Agendar Cita" },
  { to: "/nosotros", label: "Nosotros" },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-zinc-900 border-l border-white/10 transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <span className="text-white font-semibold">Menú</span>
          <button
            onClick={onClose}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all text-lg font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: { bg: "bg-green-600", icon: "✓" },
    error: { bg: "bg-red-600", icon: "✕" },
  };

  const s = styles[type];

  return (
    <div className={`fixed top-6 right-6 z-[100] ${s.bg} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in`}>
      <span className="text-lg font-bold">{s.icon}</span>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white text-xl leading-none">&times;</button>
    </div>
  );
}

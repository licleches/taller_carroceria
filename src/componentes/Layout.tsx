import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { logEvent } from "../lib/logger";
import { getRequestMeta, getClientIP } from "../lib/requestMeta";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    const { client, userAgent, referer } = getRequestMeta();
    getClientIP().then((ip) => {
      logEvent({
        category: "VISIT", severity: "INFO",
        user: "anónimo", ip, method: "GET",
        resource: location.pathname, statusCode: 200,
        message: `Página visitada: ${location.pathname}`,
        client, userAgent, referer,
      });
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

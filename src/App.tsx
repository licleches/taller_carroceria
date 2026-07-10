import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./componentes/Layout";
import AdminRoute from "./pages/admin/AdminRoute";
import Agendar from "./pages/agendar";
import Cotizar from "./pages/cotizar";
import Home from "./pages/Home";
import Servicios from "./pages/servicios";
import Nosotros from "./pages/us";
import AdminLogin from "./pages/admin/Login";
import AdminHome from "./pages/admin/AdminHome";
import QuotesList from "./pages/admin/Dashboard";
import QuoteDetail from "./pages/admin/QuoteDetail";
import CalendarPage from "./pages/admin/CalendarPage";
import LogViewer from "./pages/admin/LogViewer";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
          <Route path="/admin/quotes" element={<AdminRoute><QuotesList /></AdminRoute>} />
          <Route path="/admin/quote/:id" element={<AdminRoute><QuoteDetail /></AdminRoute>} />
          <Route path="/admin/calendar" element={<AdminRoute><CalendarPage /></AdminRoute>} />
          <Route path="/admin/logs" element={<AdminRoute><LogViewer /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/agendar" element={<Agendar />} />
                <Route path="/cotizar" element={<Cotizar />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

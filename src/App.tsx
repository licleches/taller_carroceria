import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./componentes/Layout";
import Agendar from "./pages/agendar";
import Cotizar from "./pages/cotizar";
import Home from "./pages/Home";
import Servicios from "./pages/servicios";
import Nosotros from "./pages/us";

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;

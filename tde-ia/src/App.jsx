import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NovaFonte from "./pages/NovaFonte/NovaFonte";
import ConectarMongo from "./pages/NovaFonte/ConectarMongo";
import ConectarMySQL from "./pages/NovaFonte/ConectarMySQL";
import Perguntas from "./pages/Perguntas/Perguntas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nova-fonte" element={<NovaFonte />} />
        <Route path="/conectar-mongo" element={<ConectarMongo />} />
        <Route path="/conectar-mysql" element={<ConectarMySQL />} />
        <Route path="/perguntas" element={<Perguntas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
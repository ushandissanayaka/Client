
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AcneHome from './pages/module_01_pages/AcneHome';
import PsoriasisHome from './pages/module_02_pages/PsoriasisHome';
import MelanomaHome from './pages/module_03_pages/MelanomaHome';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module-1/acne" element={<AcneHome />} />
        <Route path="/module-2/psoriasis" element={<PsoriasisHome />} />
        <Route path="/module-3/melanoma" element={<MelanomaHome />} />
      </Routes>
    </div>
  );
}

export default App;

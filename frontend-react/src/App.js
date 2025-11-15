import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Guidelines from './pages/Guidelines';
import Consultation from './pages/Consultation';
import './App.css';

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/consultation" element={<Consultation />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;

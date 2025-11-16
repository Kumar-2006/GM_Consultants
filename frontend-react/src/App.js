import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Guidelines from "./pages/Guidelines";
import Consultation from "./pages/Consultation";
import ScrollToTop from "./components/ui/ScrollToTop";
import { NotificationProvider } from "./context/NotificationContext";
import "./App.css";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/consultation" element={<Consultation />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <NotificationProvider>
    <BrowserRouter>
      <Layout>
        <ScrollToTop />
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  </NotificationProvider>
);

export default App;

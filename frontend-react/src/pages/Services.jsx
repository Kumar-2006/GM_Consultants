import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ServiceGrid from "../components/ServiceGrid";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import ServiceModal from "../components/services/ServiceModal";
import { getServices } from "../api/client";
import { servicesHeroMedia } from "../assets/media";
import "./Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await getServices();
        if (active) {
          setServices(data);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load services.");
          setServices([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="services-page">
      <section className="services-hero">
        <motion.div
          className="services-hero__media"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="services-hero__image"
            style={{ backgroundImage: `url(${servicesHeroMedia.background})` }}
          />
          <div
            className="services-hero__overlay"
            style={{ backgroundImage: servicesHeroMedia.overlay }}
          />
        </motion.div>
        <div className="services-hero__content">
          <motion.span
            className="services-hero__eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Premium Advisory
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Services designed for architectural approval success
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Every engagement blends blueprint diagnostics, compliance
            forecasting, and concierge-grade coordination so your development
            advances without friction.
          </motion.p>
        </div>
      </section>

      <section className="services-body">
        {loading ? (
          <LoadingState message="Loading services..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : services.length === 0 ? (
          <EmptyState message="Services will appear once configured. Connect with us for a tailored approvals roadmap." />
        ) : (
          <ServiceGrid services={services} onSelect={setSelectedService} />
        )}
      </section>

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
};

export default Services;

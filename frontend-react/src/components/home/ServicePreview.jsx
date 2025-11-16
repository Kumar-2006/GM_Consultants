import { motion } from "framer-motion";
import Button from "../ui/Button";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import EmptyState from "../ui/EmptyState";
import { serviceImageMap } from "../../assets/media";
import "../../pages/Home.css";

const ServicePreview = ({ services = [], loading, error }) => {
  const featured = services.slice(0, 4);

  return (
    <section className="section section--services">
      <div className="container">
        <header className="section__header">
          <span className="section__eyebrow">Core Services</span>
          <h2 className="section__title">
            End-to-end approvals orchestration with architectural polish
          </h2>
          <p className="section__description">
            Photographic site insights, compliance analytics, and premium
            advisory converge to keep your development on the fast lane from
            concept to occupancy.
          </p>
        </header>
        {loading ? (
          <LoadingState message="Loading services..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : featured.length === 0 ? (
          <EmptyState message="Services will appear here once configured. Reach out to our team for a curated walkthrough." />
        ) : (
          <div className="service-preview__grid">
            {featured.map((service, index) => {
              const image =
                serviceImageMap[service.title] || serviceImageMap.default;
              return (
                <motion.article
                  key={service._id || service.id || service.title}
                  className="service-preview__card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    delay: index * 0.12,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  whileHover={{ translateY: -12 }}
                >
                  <div className="service-preview__media">
                    <img
                      src={image}
                      alt="Architectural visualization"
                      loading="lazy"
                    />
                    <div className="service-preview__media-overlay" />
                  </div>
                  <div className="service-preview__content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <Button as="a" href="/services" variant="ghost" size="sm">
                      Explore capability
                    </Button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicePreview;

import { motion } from "framer-motion";
import { serviceImageMap } from "../assets/media";
import "./ServiceGrid.css";

const ServiceGrid = ({ services = [], onSelect }) => (
  <div className="service-grid">
    {services.map((service, index) => {
      const image = serviceImageMap[service.title] || serviceImageMap.default;

      return (
        <motion.article
          key={service._id || service.id || service.title}
          className="service-card"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }}
          whileHover={{ translateY: -10 }}
          onClick={onSelect ? () => onSelect(service) : undefined}
          tabIndex={onSelect ? 0 : -1}
          role={onSelect ? "button" : "article"}
          onKeyDown={
            onSelect
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(service);
                  }
                }
              : undefined
          }
        >
          <div className="service-card__media" aria-hidden>
            <img src={image} alt="Architectural service" loading="lazy" />
            <div className="service-card__gradient" />
          </div>
          <div className="service-card__body">
            <div className="service-card__meta">
              <span className="service-card__index">0{index + 1}</span>
              <span className="service-card__tag">Premium Advisory</span>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            {onSelect ? (
              <span className="service-card__cta">Tap for full brief →</span>
            ) : null}
          </div>
        </motion.article>
      );
    })}
  </div>
);

export default ServiceGrid;

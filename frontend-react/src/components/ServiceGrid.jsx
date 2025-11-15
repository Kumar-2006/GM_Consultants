import './ServiceGrid.css';

const ServiceGrid = ({ services = [] }) => (
  <section className="service-grid">
    {services.map((service) => (
      <article key={service._id || service.id} className="service-card">
        <div className="service-card__icon" aria-hidden>
          <span>🏛️</span>
        </div>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </article>
    ))}
  </section>
);

export default ServiceGrid;

import { FiClipboard, FiLayers, FiCompass, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import Skeleton from '../ui/Skeleton';

const iconMap = [FiClipboard, FiLayers, FiCompass, FiFileText];

const ServicePreview = ({ services = [], loading, error }) => (
  <section className="section">
    <div className="container">
      <header className="section__header">
        <span className="section__eyebrow">Expertise</span>
        <h2 className="section__title">Comprehensive approvals orchestration</h2>
        <p className="section__description">
          From blueprint strategy to authority handover, our team manages every statutory touchpoint with precision,
          velocity, and executive-grade reporting.
        </p>
      </header>
      {loading ? (
        <div className="service-preview__loading">
          <Loader label="Fetching services" />
        </div>
      ) : error ? (
        <div className="service-preview__error">
          <p>Unable to load services at the moment. Please refresh.</p>
        </div>
      ) : (
        <div className="service-preview__grid">
          {(services || []).slice(0, 4).map((service, index) => {
            const Icon = iconMap[index] ?? FiClipboard;
            return (
              <motion.article
                key={service._id || service.id || service.title}
                className="service-preview__card"
                whileHover={{ translateY: -10 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <span className="service-preview__icon">
                  <Icon size={22} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Button as="a" href="/services" variant="ghost" size="sm">
                  Explore capability
                </Button>
              </motion.article>
            );
          })}
          {services.length === 0 && !loading ? (
            <div className="service-preview__card">
              <Skeleton lines={4} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  </section>
);

export default ServicePreview;

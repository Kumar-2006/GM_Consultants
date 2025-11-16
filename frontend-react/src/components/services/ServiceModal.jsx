import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { serviceImageMap } from "../../assets/media";
import "./ServiceModal.css";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const ServiceModal = ({ service, onClose }) => (
  <AnimatePresence>
    {service ? (
      <motion.div
        className="modal"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="modal__backdrop"
          onClick={onClose}
          variants={backdropVariants}
        />
        <motion.div
          className="modal__content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <header className="modal__header">
            <div>
              <h3 id="service-modal-title">{service.title}</h3>
              <p>{service.description}</p>
            </div>
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="Close service details"
            >
              <FiX size={20} />
            </button>
          </header>
          <div className="modal__body">
            <div className="service-modal__media">
              <img
                src={serviceImageMap[service.title] || serviceImageMap.default}
                alt={`${service.title} visual`}
                loading="lazy"
              />
            </div>
            <p>
              {service.detailedDescription ||
                "Our advisory squad delivers end-to-end orchestration for this engagement—from compliance diagnostics to submission curation and authority follow-through."}
            </p>
            <ul className="service-modal__list">
              <li>Authority alignment roadmap with milestone visibility.</li>
              <li>
                Documentation intelligence covering blueprints, statements, and
                affidavits.
              </li>
              <li>
                Real-time escalation support with a dedicated approvals pod.
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export default ServiceModal;

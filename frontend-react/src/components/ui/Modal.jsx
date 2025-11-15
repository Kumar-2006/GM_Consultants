import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const contentVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 24 }
  },
  exit: { opacity: 0, y: -20, scale: 0.96 }
};

const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="modal"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
      >
        <motion.div className="modal__backdrop" onClick={onClose} />
        <motion.div className="modal__content" variants={contentVariants}>
          <header className="modal__header">
            <h3>{title}</h3>
            <button type="button" onClick={onClose} aria-label="Close" className="modal__close">
              <FiX size={22} />
            </button>
          </header>
          <div className="modal__body">{children}</div>
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export default Modal;

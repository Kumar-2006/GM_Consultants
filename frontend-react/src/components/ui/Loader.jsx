import { motion } from "framer-motion";

const Loader = ({ label = "Loading" }) => (
  <div className="loader" role="status" aria-live="polite">
    <motion.span
      className="loader__orb"
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
    <motion.span
      className="loader__orb"
      animate={{
        scale: [1, 1.25, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{ duration: 1.35, repeat: Infinity, delay: 0.25 }}
    />
    <span className="loader__label">{label}</span>
  </div>
);

export default Loader;

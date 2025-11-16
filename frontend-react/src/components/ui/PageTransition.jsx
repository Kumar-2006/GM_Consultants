import { motion } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

const PageTransition = ({ children }) => (
  <motion.div
    className="page-transition"
    variants={variants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

export default PageTransition;

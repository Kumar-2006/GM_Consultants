import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

const StatCounter = ({ value = 0, prefix = '', suffix = '+', label, delay = 0 }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.6,
      delay,
      ease: 'easeOut'
    });
    return () => controls.stop();
  }, [motionValue, value, delay]);

  return (
    <motion.div
      className="stat-counter"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.span className="stat-counter__value">
        {prefix}
        <motion.span>{rounded}</motion.span>
        {suffix}
      </motion.span>
      <span className="stat-counter__label">{label}</span>
    </motion.div>
  );
};

export default StatCounter;

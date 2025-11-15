import { motion } from 'framer-motion';

const NotificationShroud = () => (
  <motion.div
    aria-hidden
    className="notification-shroud"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.75 }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
  />
);

export default NotificationShroud;

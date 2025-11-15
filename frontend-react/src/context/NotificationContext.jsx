import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuid } from 'uuid';
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import '../styles/global.css';

const NotificationContext = createContext();

const variantStyles = {
  success: {
    icon: <FiCheckCircle size={20} />,
    background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.22), rgba(46, 204, 113, 0.05))',
    border: '1px solid rgba(46, 204, 113, 0.35)'
  },
  info: {
    icon: <FiInfo size={20} />,
    background: 'linear-gradient(135deg, rgba(44, 130, 201, 0.22), rgba(44, 130, 201, 0.05))',
    border: '1px solid rgba(44, 130, 201, 0.35)'
  },
  warning: {
    icon: <FiAlertTriangle size={20} />,
    background: 'linear-gradient(135deg, rgba(241, 196, 15, 0.22), rgba(241, 196, 15, 0.06))',
    border: '1px solid rgba(241, 196, 15, 0.35)'
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(({ title, message, type = 'info', duration = 4200 }) => {
    const id = uuid();

    setNotifications((prev) => [
      ...prev,
      {
        id,
        title,
        message,
        type,
        createdAt: Date.now()
      }
    ]);

    if (duration) {
      setTimeout(() => removeNotification(id), duration);
    }
  }, [removeNotification]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notification-stack">
        <AnimatePresence initial={false}>
          {notifications.map(({ id, title, message, type }) => {
            const variant = variantStyles[type] ?? variantStyles.info;
            return (
              <motion.div
                key={id}
                layout
                initial={{ y: 32, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                style={{
                  background: variant.background,
                  border: variant.border
                }}
                className="notification-card"
              >
                <span className="notification-card__icon">{variant.icon}</span>
                <div className="notification-card__content">
                  {title ? <p className="notification-card__title">{title}</p> : null}
                  {message ? <p className="notification-card__message">{message}</p> : null}
                </div>
                <button className="notification-card__close" onClick={() => removeNotification(id)}>
                  <FiX />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

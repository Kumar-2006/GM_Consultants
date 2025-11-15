import { forwardRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import '../../styles/global.css';

const getMotionComponent = (as) => {
  switch (as) {
    case 'a':
      return motion.a;
    case 'div':
      return motion.div;
    default:
      return motion.button;
  }
};

const Button = forwardRef(({ children, as = 'button', variant = 'primary', size = 'md', icon, className, ...props }, ref) => {
  const [ripple, setRipple] = useState(null);

  const handleClick = (event) => {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    const diameter = Math.max(event.currentTarget.clientWidth, event.currentTarget.clientHeight);
    const x = event.clientX - left - diameter / 2;
    const y = event.clientY - top - diameter / 2;

    setRipple({ x, y, diameter, key: Date.now() });

    if (typeof props.onClick === 'function') {
      props.onClick(event);
    }
  };

  const variantClass = useMemo(() => `button--${variant}`, [variant]);
  const sizeClass = useMemo(() => `button--${size}`, [size]);
  const MotionComponent = useMemo(() => getMotionComponent(as), [as]);

  return (
    <MotionComponent
      ref={ref}
      whileHover={{ translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      className={clsx('button', variantClass, sizeClass, className)}
      onClick={handleClick}
      {...props}
    >
      {icon ? <span className="button__icon">{icon}</span> : null}
      <span>{children}</span>
      {ripple ? (
        <span
          className="button__ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.diameter,
            height: ripple.diameter
          }}
          key={ripple.key}
        />
      ) : null}
    </MotionComponent>
  );
});

export default Button;

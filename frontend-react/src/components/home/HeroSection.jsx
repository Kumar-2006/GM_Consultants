import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../ui/Button';

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero__background" style={{ y, opacity }} aria-hidden />
      <div className="container hero__inner">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="section__eyebrow">Building Approvals. Made Simple.</span>
          <h1>
            Fast-track regulatory approvals with a <span>concierge-grade</span> advisory team.
          </h1>
          <p>
            GM Consultants transforms statutory compliance into a competitive edge—aligning architects, developers, and
            regulators through intelligent workflows, actionable insights, and meticulous documentation.
          </p>
          <div className="hero__actions">
            <Button variant="primary" size="lg" as="a" href="/consultation">
              Request Consultation
            </Button>
            <Button variant="ghost" size="lg" as="a" href="/guidelines">
              Explore Guidelines
            </Button>
          </div>
          <div className="hero__metrics">
            <div>
              <span>98%</span>
              <p>approval success rate across municipal and state authorities.</p>
            </div>
            <div>
              <span>120+</span>
              <p>projects accelerated in residential, commercial & industrial segments.</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          <div className="hero__visual-card glass-surface">
            <div className="hero__visual-grid">
              <div>
                <p className="hero__visual-label">Smart Checklist</p>
                <p>Automated compliance scoring for CMDA / DTCP submissions.</p>
              </div>
              <div>
                <p className="hero__visual-label">Authority Pulse</p>
                <p>Live status signals and engagement notes for every file.</p>
              </div>
              <div>
                <p className="hero__visual-label">Risk Radar</p>
                <p>Predictive alerts on FSI, GDCR, fire safety, and environmental clearances.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

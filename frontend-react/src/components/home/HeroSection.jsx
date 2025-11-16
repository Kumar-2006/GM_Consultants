import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Button from "../ui/Button";
import { heroMedia } from "../../assets/media";
import "../../pages/Home.css";

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section className="hero hero--image" ref={ref}>
      <motion.div
        className="hero__background"
        style={{ y: backgroundY }}
        aria-hidden
      >
        <div
          className="hero__background-image"
          style={{ backgroundImage: `url(${heroMedia.background})` }}
        />
        <div
          className="hero__background-overlay"
          style={{ backgroundImage: heroMedia.overlay }}
        />
      </motion.div>
      <div className="container hero__inner">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y: foregroundY }}
        >
          <span className="section__eyebrow">
            Building Approvals. Made Simple.
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Building Approvals. <span>Made Simple.</span>
          </motion.h1>
          <p>
            GM Consultants transforms statutory compliance into an architectural
            advantage—pairing photographic site intelligence with
            concierge-grade authority liaison to accelerate every submission.
          </p>
          <div className="hero__actions">
            <Button variant="primary" size="lg" as="a" href="/consultation">
              Request Consultation
            </Button>
            <Button variant="ghost" size="lg" as="a" href="/services">
              View Services
            </Button>
          </div>
          <div className="hero__metrics">
            <div>
              <span>98%</span>
              <p>
                Approval success rate across CMDA, DTCP, and civic authorities.
              </p>
            </div>
            <div>
              <span>120+</span>
              <p>
                Projects accelerated for developers, architects, and
                infrastructure majors.
              </p>
            </div>
            <div>
              <span>24/7</span>
              <p>
                Authority engagement desk tracking progress, escalations, and
                compliance shifts.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          style={{ y: foregroundY }}
        >
          <div className="hero__visual-card glass-surface">
            <div className="hero__visual-grid">
              <div>
                <p className="hero__visual-label">Blueprint Diagnostics</p>
                <p>
                  Digitised plan reviews highlighting FSI, zoning, and setback
                  risks instantly.
                </p>
              </div>
              <div>
                <p className="hero__visual-label">Regulatory Pulse</p>
                <p>
                  Live dashboards capturing authority meetings, file stages, and
                  escalation notes.
                </p>
              </div>
              <div>
                <p className="hero__visual-label">Stakeholder Sync</p>
                <p>
                  Executive-ready reports aligning architects, legal teams, and
                  investors weekly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="hero__scroll" aria-hidden>
        <span />
        <p>Scroll to explore the experience</p>
      </div>
    </section>
  );
};

export default HeroSection;

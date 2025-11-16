import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMap, FiLayers, FiDroplet, FiShield } from "react-icons/fi";
import { guidelineVisuals } from "../assets/media";
import "./GuidelineAccordion.css";

const icons = [FiLayers, FiMap, FiDroplet, FiShield];

const GuidelineAccordion = ({ guidelines = [] }) => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="guideline-list">
      {guidelines.map((guideline, index) => {
        const id = guideline._id || guideline.id || `guide-${index}`;
        const isOpen = openId === id;
        const Icon = icons[index % icons.length];
        const visual = guidelineVisuals[index % guidelineVisuals.length];

        return (
          <motion.article
            key={id}
            className={`guideline ${isOpen ? "guideline--open" : ""}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <button
              type="button"
              className="guideline__header"
              onClick={() => toggle(id)}
              aria-expanded={isOpen}
            >
              <span className="guideline__icon" aria-hidden>
                <Icon size={22} />
              </span>
              <div className="guideline__title-group">
                <h3>{guideline.title}</h3>
                <p>{visual.title}</p>
              </div>
              <span className="guideline__chevron" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  className="guideline__content"
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <div className="guideline__media" aria-hidden>
                    <img src={visual.image} alt="" loading="lazy" />
                  </div>
                  <p>{guideline.content}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
};

export default GuidelineAccordion;

import { motion } from "framer-motion";
import { FiShield, FiTrendingUp, FiUsers } from "react-icons/fi";
import { differentiators } from "../../assets/content";
import "../../pages/Home.css";

const iconMap = {
  FiShield,
  FiTrendingUp,
  FiUsers,
};

const ExpertiseHighlights = () => (
  <section className="section section--expertise">
    <div className="container">
      <header className="section__header">
        <span className="section__eyebrow">Our Expertise</span>
        <h2 className="section__title">
          High-touch advisory for complex approval landscapes
        </h2>
        <p className="section__description">
          A multi-disciplinary team of planners, legal strategists, and
          documentation specialists driving certainty for every submission and
          stakeholder conversation.
        </p>
      </header>
      <div className="expertise-grid">
        {differentiators.map((item, index) => {
          const Icon = iconMap[item.icon] || FiShield;
          return (
            <motion.article
              key={item.title}
              className="expertise-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <span className="expertise-card__icon">
                <Icon size={26} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);

export default ExpertiseHighlights;

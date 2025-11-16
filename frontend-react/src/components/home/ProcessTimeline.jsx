import { motion } from "framer-motion";
import { processSteps } from "../../assets/content";

const ProcessTimeline = () => (
  <section className="section">
    <div className="container process">
      <header className="section__header">
        <span className="section__eyebrow">Workflow</span>
        <h2 className="section__title">
          An accelerated, transparent approval journey
        </h2>
        <p className="section__description">
          Each project is guided through a proven approval framework calibrated
          to regional statutes, authority expectations, and your development
          ambitions.
        </p>
      </header>
      <div className="process__rail">
        {processSteps.map((step, index) => (
          <motion.article
            key={step.id}
            className="process__card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.12, duration: 0.6, ease: "easeOut" }}
          >
            <span className="process__timeline">{step.timeline}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <span className="process__index">0{index + 1}</span>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessTimeline;

import { motion } from "framer-motion";

const SectionHeader = ({ eyebrow, title, description, align = "center" }) => (
  <motion.header
    className="section__header"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    style={{ textAlign: align }}
  >
    {eyebrow ? <span className="section__eyebrow">{eyebrow}</span> : null}
    {title ? <h2 className="section__title">{title}</h2> : null}
    {description ? <p className="section__description">{description}</p> : null}
  </motion.header>
);

export default SectionHeader;

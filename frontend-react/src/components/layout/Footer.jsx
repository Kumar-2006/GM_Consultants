import { motion } from "framer-motion";
import { FiLinkedin, FiMail, FiPhone } from "react-icons/fi";
import "../../styles/global.css";

const footerLinks = [
  {
    label: "Services",
    items: [
      "Building Plan Approval",
      "Layout Planning & Compliance",
      "Statutory Documentation",
      "Regulatory Advisory",
    ],
  },
  {
    label: "Resources",
    items: [
      "Guideline Library",
      "Knowledge Hub",
      "Case Studies",
      "Compliance Checklist",
    ],
  },
];

const socialLinks = [
  { icon: <FiLinkedin />, label: "LinkedIn", href: "https://www.linkedin.com" },
  { icon: <FiMail />, label: "Email", href: "mailto:info@gmconsultants.com" },
  { icon: <FiPhone />, label: "Call", href: "tel:+919876543210" },
];

const Footer = ({ year }) => (
  <footer className="site-footer">
    <div className="container site-footer__inner">
      <div className="site-footer__brand">
        <span className="brand-mark">GM</span>
        <div>
          <h4>GM Consultants</h4>
          <p>
            Building approvals, compliance, and statutory guidance accelerated.
          </p>
        </div>
      </div>
      <div className="site-footer__grid">
        {footerLinks.map((column) => (
          <div key={column.label} className="site-footer__column">
            <p className="site-footer__column-label">{column.label}</p>
            <ul>
              {column.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="site-footer__column">
          <p className="site-footer__column-label">Connect</p>
          <div className="site-footer__social">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                {link.icon}
                <span>{link.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <div className="site-footer__meta">
        <p>© {year} GM Consultants. All rights reserved.</p>
        <p>15/7, 2nd floor, 22nd Cross Street, Indra Nagar, Chennai - 600041</p>
      </div>
    </div>
  </footer>
);

export default Footer;

import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer__brand">
      © {new Date().getFullYear()} GM Consultants
    </div>
    <div className="footer__links">
      <a href="mailto:info@gmconsultants.com">info@gmconsultants.com</a>
      <span>•</span>
      <span>+91 98765 43210</span>
    </div>
  </footer>
);

export default Footer;

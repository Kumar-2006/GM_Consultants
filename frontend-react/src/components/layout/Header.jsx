import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import clsx from "clsx";
import Logo from "../../assets/images/logo.jpg";
import "../../styles/global.css";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/guidelines", label: "Guidelines" },
  { to: "/consultation", label: "Consultation" },
];

const Header = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 36);
  });

  return (
    <motion.header
      className={clsx("site-header", { "site-header--compact": scrolled })}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="site-header__inner container">
        <div className="site-header__brand">
          <NavLink to="/" aria-label="GM Consultants home">
            <img
              src={Logo}
              alt="GM Consultants"
              className="site-header__logo"
            />
            <span className="visually-hidden">GM Consultants</span>
          </NavLink>
        </div>
        <nav className={clsx("site-nav", { "site-nav--open": menuOpen })}>
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                clsx("site-nav__link", { "site-nav__link--active": isActive })
              }
              onClick={() => setMenuOpen(false)}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/consultation"
            className="site-nav__cta"
            onClick={() => setMenuOpen(false)}
          >
            Request Consultation
          </NavLink>
        </nav>
        <button
          type="button"
          className="site-header__toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
    </motion.header>
  );
};

export default Header;

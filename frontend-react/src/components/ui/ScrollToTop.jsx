import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [pathname, prefersReducedMotion]);

  return null;
};

export default ScrollToTop;

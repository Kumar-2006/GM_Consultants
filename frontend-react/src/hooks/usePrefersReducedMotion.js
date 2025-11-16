import { useEffect, useState } from "react";

const MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
const supportsMatchMedia =
  typeof window !== "undefined" && typeof window.matchMedia === "function";

const getInitialValue = () => {
  if (!supportsMatchMedia) {
    return false;
  }
  return window.matchMedia(MEDIA_QUERY).matches;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(getInitialValue);

  useEffect(() => {
    if (!supportsMatchMedia) {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(MEDIA_QUERY);
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleChange);
    } else {
      mediaQueryList.addListener(handleChange);
    }

    setPrefersReducedMotion(mediaQueryList.matches);

    return () => {
      if (typeof mediaQueryList.removeEventListener === "function") {
        mediaQueryList.removeEventListener("change", handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

export default usePrefersReducedMotion;

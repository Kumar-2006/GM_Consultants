import Lottie from "lottie-react";
import useLottieAnimation from "../hooks/useLottieAnimation";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { lottieAnimations } from "../assets/media";
import "./LoadingState.css";

const LoadingState = ({ message = "Loading..." }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationData = useLottieAnimation(
    prefersReducedMotion ? null : lottieAnimations.loading,
  );

  return (
    <div className="loading-state" role="status" aria-live="polite">
      {animationData ? (
        <Lottie
          className="loading-state__animation"
          animationData={animationData}
          loop={!prefersReducedMotion}
          autoPlay={!prefersReducedMotion}
          aria-hidden="true"
        />
      ) : (
        <span className="loading-state__spinner" aria-hidden="true" />
      )}
      <span className="loading-state__message">{message}</span>
    </div>
  );
};

export default LoadingState;

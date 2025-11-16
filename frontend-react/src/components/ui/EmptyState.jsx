import Lottie from "lottie-react";
import useLottieAnimation from "../../hooks/useLottieAnimation";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import { lottieAnimations } from "../../assets/media";
import "./EmptyState.css";

const EmptyState = ({ message = "Nothing to display yet." }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationData = useLottieAnimation(
    prefersReducedMotion ? null : lottieAnimations.empty,
  );

  return (
    <div className="empty-state" role="status" aria-live="polite">
      {animationData ? (
        <Lottie
          className="empty-state__animation"
          animationData={animationData}
          loop={!prefersReducedMotion}
          autoPlay={!prefersReducedMotion}
          aria-hidden="true"
        />
      ) : (
        <span className="empty-state__placeholder" aria-hidden="true">
          ∅
        </span>
      )}
      <p className="empty-state__message">{message}</p>
    </div>
  );
};

export default EmptyState;

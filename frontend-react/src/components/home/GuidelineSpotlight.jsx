import { motion } from "framer-motion";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import EmptyState from "../ui/EmptyState";
import { guidelineVisuals } from "../../assets/media";
import "../../pages/Home.css";

const GuidelineSpotlight = ({ guidelines = [], loading, error }) => {
  const highlighted = guidelines.slice(0, 3);

  return (
    <section className="section section--guideline-spotlight">
      <div className="container">
        <header className="section__header">
          <span className="section__eyebrow">Guideline Intelligence</span>
          <h2 className="section__title">
            Interactive briefs that decode compliance complexity
          </h2>
          <p className="section__description">
            Blueprint visuals, zoning cues, and fire-safety essentials distilled
            into immersive cards curated by our consultants.
          </p>
        </header>
        {loading ? (
          <LoadingState message="Loading guidelines..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : highlighted.length === 0 ? (
          <EmptyState message="No guidelines available right now. Check back soon for fresh insights." />
        ) : (
          <div className="guideline-spotlight__grid">
            {highlighted.map((guideline, index) => {
              const visual =
                guidelineVisuals[index] ??
                guidelineVisuals[index % guidelineVisuals.length];
              return (
                <motion.article
                  key={guideline._id || guideline.id || guideline.title}
                  className="guideline-spotlight__card"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.55,
                    ease: "easeOut",
                  }}
                >
                  <div className="guideline-spotlight__media" aria-hidden>
                    <img src={visual.image} alt="" loading="lazy" />
                    <span className="guideline-spotlight__badge">
                      {visual.title}
                    </span>
                  </div>
                  <div className="guideline-spotlight__content">
                    <h3>{guideline.title}</h3>
                    <p>
                      {guideline.content?.slice(0, 180)}
                      {guideline.content?.length > 180 ? "…" : ""}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default GuidelineSpotlight;

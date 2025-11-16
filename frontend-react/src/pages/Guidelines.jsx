import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getGuidelines } from "../api/client";
import "./Guidelines.css";

const Guidelines = () => {
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGuidelines = async () => {
      try {
        const data = await getGuidelines();
        setGuidelines(data);
      } catch (err) {
        setError(err.message || "Unable to load guidelines.");
      } finally {
        setLoading(false);
      }
    };

    loadGuidelines();
  }, []);

  return (
    <div className="guidelines-page">
      <header className="guidelines-header">
        <h1>Planning Guidelines & Compliance Insights</h1>
        <p>
          Refer to concise briefs curated by our consultants covering FSI rules,
          zoning norms, fire safety, and more.
        </p>
      </header>

      {loading ? (
        <LoadingState message="Loading guidelines..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <section className="guidelines-grid" aria-live="polite">
          {guidelines.map((guideline, index) => {
            const displaySubtitle =
              guideline.subtitle || guideline.topic || guideline.category || null;
            const imageSrc =
              guideline.imageURL || guideline.imageUrl || guideline.mediaUrl || "";

            return (
              <motion.article
                key={guideline._id || guideline.id || `guideline-${index}`}
                className="guideline-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
              >
                <header className="guideline-card__header">
                  <span className="guideline-card__badge">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="guideline-card__titles">
                    <h3>{guideline.title}</h3>
                    {displaySubtitle ? (
                      <p className="guideline-card__subtitle">{displaySubtitle}</p>
                    ) : null}
                  </div>
                </header>
                <p className="guideline-card__content">{guideline.content}</p>
                {imageSrc ? (
                  <figure className="guideline-card__media">
                    <img src={imageSrc} alt="" loading="lazy" />
                  </figure>
                ) : null}
              </motion.article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Guidelines;

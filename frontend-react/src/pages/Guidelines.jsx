import { useEffect, useState } from "react";
import GuidelineAccordion from "../components/GuidelineAccordion";
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
        <GuidelineAccordion guidelines={guidelines} />
      )}
    </div>
  );
};

export default Guidelines;

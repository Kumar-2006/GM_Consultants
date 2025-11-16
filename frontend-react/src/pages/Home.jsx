import { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import ServicePreview from "../components/home/ServicePreview";
import FeaturedProjects from "../components/home/FeaturedProjects";
import ExpertiseHighlights from "../components/home/ExpertiseHighlights";
import GuidelineSpotlight from "../components/home/GuidelineSpotlight";
import ProcessTimeline from "../components/home/ProcessTimeline";
import TestimonialsCarousel from "../components/home/TestimonialsCarousel";
import { getServices, getGuidelines } from "../api/client";
import "./Home.css";

const Home = () => {
  const [servicesState, setServicesState] = useState({
    data: [],
    loading: true,
    error: "",
  });
  const [guidelinesState, setGuidelinesState] = useState({
    data: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setServicesState((prev) => ({ ...prev, loading: true }));
      setGuidelinesState((prev) => ({ ...prev, loading: true }));

      const [servicesResult, guidelinesResult] = await Promise.allSettled([
        getServices(),
        getGuidelines(),
      ]);

      if (!isMounted) {
        return;
      }

      if (servicesResult.status === "fulfilled") {
        setServicesState({
          data: servicesResult.value,
          loading: false,
          error: "",
        });
      } else {
        setServicesState({
          data: [],
          loading: false,
          error: servicesResult.reason?.message || "Unable to load services.",
        });
      }

      if (guidelinesResult.status === "fulfilled") {
        setGuidelinesState({
          data: guidelinesResult.value,
          loading: false,
          error: "",
        });
      } else {
        setGuidelinesState({
          data: [],
          loading: false,
          error:
            guidelinesResult.reason?.message || "Unable to load guidelines.",
        });
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page">
      <HeroSection />
      <ServicePreview
        services={servicesState.data}
        loading={servicesState.loading}
        error={servicesState.error}
      />
      <FeaturedProjects />
      <ExpertiseHighlights />
      <GuidelineSpotlight
        guidelines={guidelinesState.data}
        loading={guidelinesState.loading}
        error={guidelinesState.error}
      />
      <ProcessTimeline />
      <TestimonialsCarousel />
    </div>
  );
};

export default Home;

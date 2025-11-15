import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ServiceGrid from '../components/ServiceGrid';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getServices, getGuidelines } from '../api/client';
import './Home.css';

const Home = () => {
  const [services, setServices] = useState([]);
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, guidelinesData] = await Promise.all([
          getServices(),
          getGuidelines()
        ]);
        setServices(servicesData.slice(0, 3));
        setGuidelines(guidelinesData.slice(0, 3));
      } catch (err) {
        setError(err.message || 'Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="home-page">
      <Hero />

      <section className="home-section">
        <header>
          <h2>Our Core Services</h2>
          <p>Expert guidance for approvals, compliance, and development planning.</p>
        </header>
        {loading ? (
          <LoadingState message="Loading services..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <ServiceGrid services={services} />
        )}
        <div className="home-section__cta">
          <Link className="link-button" to="/services">View all services</Link>
        </div>
      </section>

      <section className="home-section home-section--alt">
        <header>
          <h2>Key Planning Guidelines</h2>
          <p>Stay ahead of compliance with concise summaries from our experts.</p>
        </header>
        {loading ? (
          <LoadingState message="Loading guidelines..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <ul className="guideline-preview">
            {guidelines.map((guide) => {
              const snippet = (guide.content || '').substring(0, 140);
              return (
                <li key={guide._id || guide.id}>
                  <h3>{guide.title}</h3>
                  <p>{snippet}{snippet.length === 140 ? '...' : ''}</p>
                </li>
              );
            })}
          </ul>
        )}
        <div className="home-section__cta">
          <Link className="link-button" to="/guidelines">Browse guidelines</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

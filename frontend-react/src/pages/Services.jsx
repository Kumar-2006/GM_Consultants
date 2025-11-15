import { useEffect, useState } from 'react';
import ServiceGrid from '../components/ServiceGrid';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getServices } from '../api/client';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError(err.message || 'Unable to load services.');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="services-page">
      <header className="services-header">
        <h1>Services Designed for Approval Success</h1>
        <p>
          From concept to completion, GM Consultants provides end-to-end support across statutory approvals,
          documentation, and compliance management.
        </p>
      </header>

      {loading ? (
        <LoadingState message="Loading services..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <ServiceGrid services={services} />
      )}
    </div>
  );
};

export default Services;

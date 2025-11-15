import { useState } from 'react';
import { submitConsultation } from '../api/client';
import './ConsultationForm.css';

const defaultState = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: ''
};

const ConsultationForm = () => {
  const [values, setValues] = useState(defaultState);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      await submitConsultation(values);
      setStatus({ type: 'success', message: 'Your consultation request has been submitted.' });
      setValues(defaultState);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to submit request.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="consultation-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
        />
      </div>

      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="form-row">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          required
          placeholder="Mobile number"
        />
      </div>

      <div className="form-row">
        <label htmlFor="projectType">Project Type</label>
        <select
          id="projectType"
          name="projectType"
          value={values.projectType}
          onChange={handleChange}
          required
        >
          <option value="">Select option</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="message">Project Details</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={values.message}
          onChange={handleChange}
          required
          placeholder="Share any site details or approvals you need assistance with"
        />
      </div>

      {status.message && (
        <div className={`form-status form-status--${status.type}`}>{status.message}</div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default ConsultationForm;

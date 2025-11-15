import ConsultationForm from '../components/ConsultationForm';
import './Consultation.css';

const Consultation = () => (
  <div className="consultation-page">
    <section className="consultation-intro">
      <h1>Book a Consultation</h1>
      <p>
        Share your project details and our approvals team will connect with you for a personalised roadmap across
        statutory submissions, documentation, and compliance.
      </p>
    </section>

    <ConsultationForm />
  </div>
);

export default Consultation;

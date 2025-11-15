import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => (
  <section className="hero">
    <div className="hero__content">
      <h1>Building Approvals Made Simple</h1>
      <p>
        GM Consultants partners with you to navigate planning regulations, statutory clearances, and
        municipal approvals quickly and confidently.
      </p>
      <div className="hero__actions">
        <Link className="hero__btn" to="/consultation">Request Consultation</Link>
        <Link className="hero__btn hero__btn--outline" to="/services">Explore Services</Link>
      </div>
    </div>
  </section>
);

export default Hero;

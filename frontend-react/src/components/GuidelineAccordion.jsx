import { useState } from 'react';
import './GuidelineAccordion.css';

const GuidelineAccordion = ({ guidelines = [] }) => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="guideline-list">
      {guidelines.map((guideline) => {
        const id = guideline._id || guideline.id;
        const isOpen = openId === id;

        return (
          <article key={id} className={`guideline ${isOpen ? 'guideline--open' : ''}`}>
            <header className="guideline__header" onClick={() => toggle(id)}>
              <h3>{guideline.title}</h3>
              <span aria-hidden>{isOpen ? '−' : '+'}</span>
            </header>
            <div className="guideline__content">
              <p>{guideline.content}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default GuidelineAccordion;

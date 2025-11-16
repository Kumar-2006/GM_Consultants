import { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { submitConsultation } from "../api/client";
import useLottieAnimation from "../hooks/useLottieAnimation";
import { lottieAnimations } from "../assets/media";
import "./ConsultationForm.css";

const defaultState = {
  name: "",
  email: "",
  phone: "",
  projectType: "",
  message: "",
};

const ConsultationForm = () => {
  const [values, setValues] = useState(defaultState);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const successAnimation = useLottieAnimation(lottieAnimations.success);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      await submitConsultation(values);
      setStatus({
        type: "success",
        message: "Your consultation request has been submitted.",
      });
      setValues(defaultState);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to submit request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      className="consultation-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="form-grid">
        <motion.div className="form-row" whileHover={{ translateY: -2 }}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="Your full name"
          />
        </motion.div>

        <motion.div className="form-row" whileHover={{ translateY: -2 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </motion.div>

        <motion.div className="form-row" whileHover={{ translateY: -2 }}>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            placeholder="Mobile number"
          />
        </motion.div>

        <motion.div className="form-row" whileHover={{ translateY: -2 }}>
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
        </motion.div>
      </div>

      <motion.div
        className="form-row form-row--full"
        whileHover={{ translateY: -2 }}
      >
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
      </motion.div>

      {status.message ? (
        <div
          className={`form-status form-status--${status.type}`}
          role="status"
          aria-live="polite"
        >
          {status.type === "success" && successAnimation ? (
            <Lottie
              className="form-status__lottie"
              animationData={successAnimation}
              loop={false}
              autoPlay
            />
          ) : null}
          <span>{status.message}</span>
        </div>
      ) : null}

      <motion.button
        type="submit"
        className="form-submit"
        disabled={loading}
        whileHover={{ translateY: loading ? 0 : -2 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? "Submitting..." : "Submit Request"}
      </motion.button>
    </motion.form>
  );
};

export default ConsultationForm;

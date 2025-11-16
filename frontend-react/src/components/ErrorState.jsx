import "./ErrorState.css";

const ErrorState = ({ message = "Unable to load data." }) => (
  <div className="error-state" role="alert" aria-live="assertive">
    <p className="error-state__title">Something went wrong.</p>
    <p className="error-state__message">{message}</p>
  </div>
);

export default ErrorState;

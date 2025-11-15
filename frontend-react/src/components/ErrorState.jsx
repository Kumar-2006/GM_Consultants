import './ErrorState.css';

const ErrorState = ({ message = 'Unable to load data.' }) => (
  <div className="error-state" role="alert">
    <strong>Something went wrong.</strong>
    <span>{message}</span>
  </div>
);

export default ErrorState;

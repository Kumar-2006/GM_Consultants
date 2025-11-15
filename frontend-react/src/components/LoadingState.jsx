import './LoadingState.css';

const LoadingState = ({ message = 'Loading...' }) => (
  <div className="loading-state" role="status" aria-live="polite">
    <span className="loading-state__spinner" />
    <span>{message}</span>
  </div>
);

export default LoadingState;

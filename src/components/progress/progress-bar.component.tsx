import './progress-bar.style.scss';

const ProgressBar = () => (
  <div className="progress-cover">
    <progress className="progress is-small is-primary" max="100">
      Loading
    </progress>
  </div>
);

export default ProgressBar;
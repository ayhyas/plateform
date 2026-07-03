export default function Loader({ dark = false, label = 'Chargement...' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className={`spinner ${dark ? 'spinner-dark' : ''}`} />
      {label && <div className="loading-label">{label}</div>}
    </div>
  );
}

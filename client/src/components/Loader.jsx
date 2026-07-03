export default function Loader({ dark = false }) {
  return (
    <div className="loading-screen">
      <div className={`spinner ${dark ? 'spinner-dark' : ''}`} />
    </div>
  );
}

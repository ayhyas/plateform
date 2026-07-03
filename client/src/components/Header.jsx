export function CrestIcon({ className = '' }) {
  return (
    <span className={`crest-badge ${className}`}>
      <img src="/logo.png" alt="Universite Chouaib Doukali" className="crest-img" />
    </span>
  );
}

export default function Header({ settings }) {
  const university = settings?.university || 'Universite Chouaib Doukali';
  const faculty = settings?.faculty || 'Faculte des Sciences';
  const degree = settings?.degree || 'Licence';
  const title = settings?.title || 'Examen de Data Science';

  return (
    <div className="institution-header">
      <span className="top-hairline" aria-hidden="true" />
      <CrestIcon className="crest" />
      <div className="university">{university}</div>
      <div className="faculty">{faculty}</div>
      <div className="header-divider">
        <span className="divider-line" />
        <span className="divider-dot" />
        <span className="divider-line right" />
      </div>
      <div className="exam-title">{title}</div>
      <div className="degree">{degree}</div>
    </div>
  );
}

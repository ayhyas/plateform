export function CrestIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 72"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="crestGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#24507f" />
          <stop offset="100%" stopColor="#0b1c30" />
        </linearGradient>
        <linearGradient id="crestGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e3c878" />
          <stop offset="100%" stopColor="#b8912a" />
        </linearGradient>
      </defs>
      <path
        d="M32 2 L60 12 V34 C60 52 48 64 32 70 C16 64 4 52 4 34 V12 Z"
        fill="url(#crestGrad)"
        stroke="url(#crestGold)"
        strokeWidth="1.8"
      />
      <path
        d="M32 7 L56 15.5 V34 C56 49.5 45.5 60.5 32 66 C18.5 60.5 8 49.5 8 34 V15.5 Z"
        fill="none"
        stroke="#d2ac47"
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />
      <text
        x="32"
        y="43"
        textAnchor="middle"
        fontFamily="Playfair Display, Georgia, serif"
        fontWeight="700"
        fontSize="20"
        fill="#d2ac47"
      >
        UCD
      </text>
    </svg>
  );
}

export default function Header({ settings }) {
  const university = settings?.university || 'Universite Chouaib Doukali';
  const faculty = settings?.faculty || 'Faculte des Sciences';
  const degree = settings?.degree || 'Licence';
  const title = settings?.title || 'Examen de Data Science';

  return (
    <div className="institution-header">
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

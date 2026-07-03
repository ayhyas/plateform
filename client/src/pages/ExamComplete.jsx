import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Clock, Info } from 'lucide-react';
import { setStudentToken } from '../services/api.js';
import Header from '../components/Header.jsx';

const MESSAGES = {
  submitted: {
    title: 'Examen termine avec succes',
    body: "Merci d'avoir passe l'examen de Data Science. Vos reponses ont bien ete enregistrees.",
    icon: Check,
    tone: 'success',
  },
  time_up: {
    title: 'Temps ecoule',
    body: "Le temps imparti pour l'examen est termine. Vos reponses ont ete enregistrees automatiquement.",
    icon: Clock,
    tone: 'warning',
  },
  already: {
    title: 'Examen deja complete',
    body: 'Vous avez deja passe cet examen. Une seule tentative est autorisee par etudiant.',
    icon: Info,
    tone: 'info',
  },
  default: {
    title: 'Session terminee',
    body: 'Votre session a ete cloturee.',
    icon: Check,
    tone: 'success',
  },
};

const REDIRECT_SECONDS = 8;

export default function ExamComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const reason = location.state?.reason || 'default';
  const settings = JSON.parse(localStorage.getItem('exam_settings') || 'null');
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    setStudentToken(null);
    localStorage.removeItem('student_info');
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/', { replace: true });
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  const message = MESSAGES[reason] || MESSAGES.default;
  const ResultIcon = message.icon;

  return (
    <div className="page">
      <Header settings={settings} />
      <div className="page-content">
        <div className="container">
          <div className="card center-text">
            <div className={`result-icon ${message.tone}`}>
              <ResultIcon size={36} strokeWidth={2.4} />
            </div>
            <h2>{message.title}</h2>
            <p className="muted mt-16">{message.body}</p>
            <p className="muted mt-24 countdown-note">
              Vous allez etre redirige automatiquement dans {countdown}s...
            </p>
            <button className="btn btn-outline mt-16" onClick={() => navigate('/', { replace: true })}>
              Retour a l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

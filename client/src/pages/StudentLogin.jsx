import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CircleAlert, Hash, Info, User } from 'lucide-react';
import api, { setStudentToken } from '../services/api.js';
import Header from '../components/Header.jsx';
import Loader from '../components/Loader.jsx';

export default function StudentLogin() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  const [form, setForm] = useState({ nom: '', prenom: '', cne: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get('/student/status')
      .then((res) => {
        if (!mounted) return;
        setSettings(res.data.settings);
        setIsOpen(res.data.isOpen);
        setStatusMessage(res.data.message);
        localStorage.setItem('exam_settings', JSON.stringify(res.data.settings));
      })
      .catch(() => {
        if (!mounted) return;
        setStatusMessage("Impossible de contacter le serveur. Reessayez plus tard.");
        setIsOpen(false);
      })
      .finally(() => mounted && setLoadingStatus(false));
    return () => {
      mounted = false;
    };
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.nom.trim() || !form.prenom.trim() || !form.cne.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/student/login', form);
      setStudentToken(res.data.token);
      localStorage.setItem(
        'student_info',
        JSON.stringify({ nom: res.data.nom, prenom: res.data.prenom })
      );
      navigate('/exam');
    } catch (err) {
      const data = err.response?.data;
      if (data?.code === 'ALREADY_COMPLETED') {
        navigate('/exam/termine', { state: { reason: 'already' } });
        return;
      }
      setError(data?.message || "Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Header settings={settings} />
      <div className="page-content">
        <div className="container">
          {loadingStatus ? (
            <Loader dark />
          ) : (
            <div className="card">
              {!isOpen && (
                <div className="alert alert-info">
                  <Info size={18} />
                  <span>{statusMessage || "L'examen n'est pas disponible actuellement."}</span>
                </div>
              )}

              <h2 className="mb-16">Acces a l'examen</h2>
              <p className="muted mb-16">
                Veuillez saisir vos informations exactement comme sur votre carte d'etudiant pour
                acceder a l'examen.
              </p>

              {error && (
                <div className="alert alert-error">
                  <CircleAlert size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="field-row">
                  <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <div className="input-icon">
                      <User size={17} />
                      <input
                        id="nom"
                        type="text"
                        autoComplete="family-name"
                        value={form.nom}
                        onChange={(e) => updateField('nom', e.target.value)}
                        disabled={!isOpen || submitting}
                        placeholder="ex: EL AMRANI"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="prenom">Prenom</label>
                    <div className="input-icon">
                      <User size={17} />
                      <input
                        id="prenom"
                        type="text"
                        autoComplete="given-name"
                        value={form.prenom}
                        onChange={(e) => updateField('prenom', e.target.value)}
                        disabled={!isOpen || submitting}
                        placeholder="ex: Yassine"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cne">CNE (Code National de l'Etudiant)</label>
                  <div className="input-icon">
                    <Hash size={17} />
                    <input
                      id="cne"
                      type="text"
                      value={form.cne}
                      onChange={(e) => updateField('cne', e.target.value)}
                      disabled={!isOpen || submitting}
                      placeholder="ex: R130000000"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={!isOpen || submitting}>
                  {submitting ? (
                    <span className="spinner" />
                  ) : (
                    <>
                      Acceder a l'examen
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

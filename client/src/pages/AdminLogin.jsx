import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleAlert, Lock, User } from 'lucide-react';
import api, { setAdminToken } from '../services/api.js';
import { CrestIcon } from '../components/Header.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.post('/admin/login', form);
      setAdminToken(res.data.token);
      navigate('/admin/resultats');
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants invalides.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="institution-header">
        <span className="top-hairline" aria-hidden="true" />
        <CrestIcon className="crest" />
        <div className="university">Université Chouaïb Doukkali</div>
        <div className="faculty">Faculté des Sciences</div>
        <div className="header-divider">
          <span className="divider-line" />
          <span className="divider-dot" />
          <span className="divider-line right" />
        </div>
        <div className="exam-title">Espace Administrateur</div>
        <div className="degree">Examen de Data Science · Pr A. Aaroud</div>
      </div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: 420 }}>
          <div className="card">
            <h2 className="mb-16">Connexion administrateur</h2>
            {error && (
              <div className="alert alert-error">
                <CircleAlert size={18} />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Identifiant</label>
                <div className="input-icon">
                  <User size={17} />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-icon">
                  <Lock size={17} />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    disabled={submitting}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? <span className="spinner" /> : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

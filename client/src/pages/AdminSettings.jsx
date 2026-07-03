import { useEffect, useState } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';

function toInputValue(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    api
      .get('/admin/settings')
      .then((res) => setForm(res.data.settings))
      .catch(() => setError('Erreur lors du chargement des paramètres.'))
      .finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSuccess(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const payload = {
        ...form,
        startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
        endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
        durationMinutes: Number(form.durationMinutes),
        totalQuestions: Number(form.totalQuestions),
        passingScore: Number(form.passingScore),
      };
      const res = await api.put('/admin/settings', payload);
      setForm(res.data.settings);
      setSuccess('Paramètres enregistrés avec succès.');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <Loader dark />;

  return (
    <div>
      <div className="toolbar">
        <div>
          <h2 className="section-title">Paramètres de l'examen</h2>
          <p className="muted">Configurez la fenêtre d'accès, la durée et le barème de réussite.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        {error && (
          <div className="alert alert-error">
            <CircleAlert size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CircleCheck size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre de l'examen</label>
            <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} />
          </div>

          <div className="field-row">
            <div className="form-group">
              <label>Université</label>
              <input type="text" value={form.university} onChange={(e) => update('university', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Faculté</label>
              <input type="text" value={form.faculty} onChange={(e) => update('faculty', e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="form-group">
              <label>Diplôme / Filière</label>
              <input type="text" value={form.degree} onChange={(e) => update('degree', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Professeur responsable</label>
              <input type="text" value={form.professor || ''} onChange={(e) => update('professor', e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="form-group">
              <label>Ouverture de l'examen</label>
              <input
                type="datetime-local"
                value={toInputValue(form.startAt)}
                onChange={(e) => update('startAt', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Fermeture de l'examen</label>
              <input
                type="datetime-local"
                value={toInputValue(form.endAt)}
                onChange={(e) => update('endAt', e.target.value)}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="form-group">
              <label>Durée (minutes)</label>
              <input
                type="number"
                min="1"
                value={form.durationMinutes}
                onChange={(e) => update('durationMinutes', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Nombre de questions par tentative</label>
              <input
                type="number"
                min="1"
                value={form.totalQuestions}
                onChange={(e) => update('totalQuestions', e.target.value)}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="form-group">
              <label>Note minimale de réussite (sur {form.totalQuestions})</label>
              <input
                type="number"
                min="0"
                value={form.passingScore}
                onChange={(e) => update('passingScore', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Statut de l'examen</label>
              <select
                value={form.isActive ? 'active' : 'inactive'}
                onChange={(e) => update('isActive', e.target.value === 'active')}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <span className="spinner" /> : 'Enregistrer les paramètres'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { CircleAlert, Inbox, Pencil, Plus, Trash2, X } from 'lucide-react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';

const EMPTY_FORM = { text: '', choices: ['', '', '', ''], correctIndex: 0, active: true, order: 0 };

function QuestionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function updateChoice(idx, value) {
    setForm((f) => {
      const choices = [...f.choices];
      choices[idx] = value;
      return { ...f, choices };
    });
  }

  function addChoice() {
    if (form.choices.length >= 6) return;
    setForm((f) => ({ ...f, choices: [...f.choices, ''] }));
  }

  function removeChoice(idx) {
    if (form.choices.length <= 2) return;
    setForm((f) => {
      const choices = f.choices.filter((_, i) => i !== idx);
      const correctIndex = f.correctIndex >= choices.length ? 0 : f.correctIndex;
      return { ...f, choices, correctIndex };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const text = form.text.trim();
    const choices = form.choices.map((c) => c.trim());

    if (!text) return setError('Le texte de la question est requis.');
    if (choices.some((c) => !c)) return setError('Tous les choix doivent être remplis.');

    setSaving(true);
    try {
      await onSave({ ...form, text, choices });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initial ? 'Modifier la question' : 'Nouvelle question'}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        {error && (
          <div className="alert alert-error">
            <CircleAlert size={18} />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Texte de la question</label>
            <input
              type="text"
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Choix (sélectionnez la bonne réponse)</label>
            {form.choices.map((choice, idx) => (
              <div key={idx} className="choice-edit-row">
                <input
                  type="radio"
                  name="correctIndex"
                  checked={form.correctIndex === idx}
                  onChange={() => setForm((f) => ({ ...f, correctIndex: idx }))}
                />
                <input
                  type="text"
                  value={choice}
                  onChange={(e) => updateChoice(idx, e.target.value)}
                  placeholder={`Choix ${String.fromCharCode(65 + idx)}`}
                />
                {form.choices.length > 2 && (
                  <button
                    type="button"
                    className="choice-remove"
                    onClick={() => removeChoice(idx)}
                    aria-label="Supprimer ce choix"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            {form.choices.length < 6 && (
              <button type="button" className="btn btn-outline btn-sm mt-8" onClick={addChoice}>
                <Plus size={14} />
                Ajouter un choix
              </button>
            )}
          </div>

          <div className="field-row">
            <div className="form-group">
              <label>Ordre d'affichage</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              />
            </div>
            <div className="form-group">
              <label>Statut</label>
              <select
                value={form.active ? 'active' : 'inactive'}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === 'active' }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner" /> : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalQuestion, setModalQuestion] = useState(undefined); // undefined = closed, null = new, obj = edit

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/admin/questions');
      setQuestions(res.data.questions);
    } catch (err) {
      setError('Erreur lors du chargement des questions.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(form) {
    if (modalQuestion && modalQuestion._id) {
      await api.put(`/admin/questions/${modalQuestion._id}`, form);
    } else {
      await api.post('/admin/questions', form);
    }
    setModalQuestion(undefined);
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette question définitivement ?')) return;
    await api.delete(`/admin/questions/${id}`);
    load();
  }

  if (loading) return <Loader dark />;

  const activeCount = questions.filter((q) => q.active).length;

  return (
    <div>
      <div className="toolbar">
        <div>
          <h2 className="section-title">Banque de questions</h2>
          <p className="muted">
            {questions.length} question(s) au total – {activeCount} active(s) et utilisée(s) dans l'examen.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalQuestion(null)}>
          <Plus size={16} />
          Nouvelle question
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <CircleAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Nb choix</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 && (
              <tr>
                <td colSpan={4} style={{ whiteSpace: 'normal' }}>
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Inbox size={24} />
                    </div>
                    <div className="empty-title">Aucune question pour le moment.</div>
                    <div className="empty-text">
                      Cliquez sur « Nouvelle question » pour commencer à construire la banque de
                      questions de l'examen.
                    </div>
                  </div>
                </td>
              </tr>
            )}
            {questions.map((q) => (
              <tr key={q._id}>
                <td style={{ whiteSpace: 'normal', maxWidth: 480 }}>{q.text}</td>
                <td>{q.choices.length}</td>
                <td>
                  {q.active ? (
                    <span className="badge badge-success">Active</span>
                  ) : (
                    <span className="badge badge-neutral">Inactive</span>
                  )}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setModalQuestion(q)}>
                      <Pencil size={14} />
                      Modifier
                    </button>
                    <button className="btn btn-ghost-danger btn-sm" onClick={() => handleDelete(q._id)}>
                      <Trash2 size={14} />
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalQuestion !== undefined && (
        <QuestionModal
          initial={modalQuestion}
          onClose={() => setModalQuestion(undefined)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';

export default function AdminResults() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data.students);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des resultats.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const completed = students.filter((s) => s.status === 'completed');
    const passed = completed.filter((s) => s.passed);
    return {
      total: students.length,
      completed: completed.length,
      inProgress: students.length - completed.length,
      passed: passed.length,
      failed: completed.length - passed.length,
    };
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (filter === 'passed' && !(s.status === 'completed' && s.passed)) return false;
      if (filter === 'failed' && !(s.status === 'completed' && !s.passed)) return false;
      if (filter === 'inprogress' && s.status !== 'in-progress') return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${s.nom} ${s.prenom} ${s.cne}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [students, filter, search]);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await api.get('/admin/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resultats_examen_datascience.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Erreur lors de l'export Excel.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette tentative ? Cela permettra a cet etudiant de repasser l\'examen.')) return;
    try {
      await api.delete(`/admin/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression.');
    }
  }

  if (loading) return <Loader dark />;

  return (
    <div>
      <div className="toolbar">
        <div>
          <h2 className="section-title">Resultats des etudiants</h2>
          <p className="muted">Suivi en temps reel des tentatives et des notes.</p>
        </div>
        <button className="btn btn-gold" onClick={handleExport} disabled={exporting || students.length === 0}>
          {exporting ? <span className="spinner" /> : 'Exporter en Excel'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-row">
        <div className="stat-card">
          <div className="value">{stats.total}</div>
          <div className="label">Etudiants</div>
        </div>
        <div className="stat-card">
          <div className="value">{stats.completed}</div>
          <div className="label">Examens termines</div>
        </div>
        <div className="stat-card">
          <div className="value">{stats.inProgress}</div>
          <div className="label">En cours</div>
        </div>
        <div className="stat-card">
          <div className="value" style={{ color: 'var(--green-600)' }}>
            {stats.passed}
          </div>
          <div className="label">Reussi(s)</div>
        </div>
        <div className="stat-card">
          <div className="value" style={{ color: 'var(--red-600)' }}>
            {stats.failed}
          </div>
          <div className="label">Echoue(s)</div>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Rechercher par nom, prenom ou CNE..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1.5px solid var(--gray-200)',
            minWidth: 260,
          }}
        />
        <div className="admin-tabs" style={{ background: 'white', borderRadius: 'var(--radius-sm)', padding: 4 }}>
          {[
            { key: 'all', label: 'Tous' },
            { key: 'passed', label: 'Reussis' },
            { key: 'failed', label: 'Echoues' },
            { key: 'inprogress', label: 'En cours' },
          ].map((f) => (
            <span
              key={f.key}
              className={`admin-tab ${filter === f.key ? 'active' : ''}`}
              style={{ color: filter === f.key ? undefined : 'var(--gray-600)' }}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prenom</th>
              <th>CNE</th>
              <th>Note</th>
              <th>Statut</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="muted" style={{ padding: 24, textAlign: 'center' }}>
                  Aucun etudiant trouve.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.nom}</td>
                <td>{s.prenom}</td>
                <td>{s.cne}</td>
                <td>{s.status === 'completed' ? `${s.score} / ${s.totalQuestions}` : '-'}</td>
                <td>
                  {s.status !== 'completed' ? (
                    <span className="badge badge-neutral">En cours</span>
                  ) : s.passed ? (
                    <span className="badge badge-success">Reussi</span>
                  ) : (
                    <span className="badge badge-danger">Echoue</span>
                  )}
                </td>
                <td>{new Date(s.completedAt || s.startedAt).toLocaleString('fr-FR')}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => handleDelete(s.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

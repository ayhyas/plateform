import { useEffect, useMemo, useState } from 'react';
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  FileSpreadsheet,
  Hourglass,
  Inbox,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
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
      setError(err.response?.data?.message || 'Erreur lors du chargement des résultats.');
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
    if (!window.confirm("Supprimer cette tentative ? Cela permettra à cet étudiant de repasser l'examen.")) return;
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
          <h2 className="section-title">Résultats des étudiants</h2>
          <p className="muted">Suivi en temps réel des tentatives et des notes.</p>
        </div>
        <button className="btn btn-gold" onClick={handleExport} disabled={exporting || students.length === 0}>
          {exporting ? (
            <span className="spinner" />
          ) : (
            <>
              <FileSpreadsheet size={16} />
              Exporter en Excel
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <CircleAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="stats-row">
        <div className="stat-card">
          <div>
            <div className="value">{stats.total}</div>
            <div className="label">Étudiants</div>
          </div>
          <div className="stat-icon">
            <Users size={20} />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="value">{stats.completed}</div>
            <div className="label">Examens terminés</div>
          </div>
          <div className="stat-icon gold">
            <CircleCheck size={20} />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="value">{stats.inProgress}</div>
            <div className="label">En cours</div>
          </div>
          <div className="stat-icon">
            <Hourglass size={20} />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="value value-success">{stats.passed}</div>
            <div className="label">Réussi(s)</div>
          </div>
          <div className="stat-icon success">
            <CircleCheck size={20} />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="value value-danger">{stats.failed}</div>
            <div className="label">Échoué(s)</div>
          </div>
          <div className="stat-icon danger">
            <CircleX size={20} />
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou CNE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="segmented">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'passed', label: 'Réussis' },
            { key: 'failed', label: 'Échoués' },
            { key: 'inprogress', label: 'En cours' },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              className={filter === f.key ? 'active' : ''}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
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
                <td colSpan={7} style={{ whiteSpace: 'normal' }}>
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Inbox size={24} />
                    </div>
                    <div className="empty-title">Aucun étudiant trouvé.</div>
                  </div>
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="cell-strong">{s.nom}</td>
                <td>{s.prenom}</td>
                <td>{s.cne}</td>
                <td className="cell-score">
                  {s.status === 'completed' ? `${s.score} / ${s.totalQuestions}` : '-'}
                </td>
                <td>
                  {s.status !== 'completed' ? (
                    <span className="badge badge-neutral">En cours</span>
                  ) : s.passed ? (
                    <span className="badge badge-success">Réussi</span>
                  ) : (
                    <span className="badge badge-danger">Échoué</span>
                  )}
                </td>
                <td>{new Date(s.completedAt || s.startedAt).toLocaleString('fr-FR')}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-ghost-danger btn-sm" onClick={() => handleDelete(s.id)}>
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
    </div>
  );
}

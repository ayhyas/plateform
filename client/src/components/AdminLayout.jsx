import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ChartColumn, ListChecks, LogOut, Settings } from 'lucide-react';
import { setAdminToken } from '../services/api.js';
import { CrestIcon } from './Header.jsx';

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    setAdminToken(null);
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <div className="admin-nav">
        <div className="brand">
          <CrestIcon className="brand-crest" />
          <span className="brand-title">Examen Data Science</span>
          <span className="dot" />
          <span className="brand-sub">Administration</span>
        </div>
        <div className="admin-tabs">
          <NavLink to="/admin/resultats" className={({ isActive }) => `admin-tab${isActive ? ' active' : ''}`}>
            <ChartColumn size={16} />
            Résultats
          </NavLink>
          <NavLink to="/admin/questions" className={({ isActive }) => `admin-tab${isActive ? ' active' : ''}`}>
            <ListChecks size={16} />
            Questions
          </NavLink>
          <NavLink to="/admin/parametres" className={({ isActive }) => `admin-tab${isActive ? ' active' : ''}`}>
            <Settings size={16} />
            Paramètres
          </NavLink>
        </div>
        <button className="btn btn-nav btn-sm" onClick={handleLogout} aria-label="Déconnexion">
          <LogOut size={15} />
          <span className="btn-nav-label">Déconnexion</span>
        </button>
      </div>
      <div className="admin-body">
        <Outlet />
      </div>
    </div>
  );
}

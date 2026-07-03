import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
          Examen Data Science
          <span className="dot" />
          Administration
        </div>
        <div className="admin-tabs">
          <NavLink to="/admin/resultats" className={({ isActive }) => `admin-tab${isActive ? ' active' : ''}`}>
            Resultats
          </NavLink>
          <NavLink to="/admin/questions" className={({ isActive }) => `admin-tab${isActive ? ' active' : ''}`}>
            Questions
          </NavLink>
          <NavLink to="/admin/parametres" className={({ isActive }) => `admin-tab${isActive ? ' active' : ''}`}>
            Parametres
          </NavLink>
        </div>
        <button className="btn btn-nav btn-sm" onClick={handleLogout}>
          Deconnexion
        </button>
      </div>
      <div className="admin-body">
        <Outlet />
      </div>
    </div>
  );
}

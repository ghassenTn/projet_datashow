import React from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './Sidebar.css';
import { IconBuilding, IconLogout } from './Icons';
import { PROF_ROUTES } from '../routes/profRoutes';
import { ADMIN_ROUTES } from '../routes/adminRoutes';

/* ══════════════════════════════════════════════
   CONFIG STATIQUE
   ══════════════════════════════════════════════ */
const USER_INFO = {
  prof:  { initials: 'GS', name: 'Ghassen Saidi',  role: 'Professeur'     },
  admin: { initials: 'DI', name: 'Directeur IPSAS', role: 'Admin Portal'   },
};

const LOGO_SUB = {
  prof:  'Espace\nProfesseur',
  admin: 'University\nManagement',
};

/* ══════════════════════════════════════════════
   COMPOSANT UNIQUE
   ══════════════════════════════════════════════ */
export default function Sidebar({ role = 'prof', onLogout }) {
  const [user, setUser] = React.useState(null);
  
  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/utilisateurs/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchMe();
  }, []);

  const navItems = (role === 'admin' ? ADMIN_ROUTES : PROF_ROUTES).filter(r => !r.hidden);
  const logoSub  = LOGO_SUB[role]  || LOGO_SUB.prof;

  const displayUser = user || (role === 'admin' ? USER_INFO.admin : USER_INFO.prof);
  
  const firstName = user ? user.prenom : (displayUser.name ? displayUser.name.split(' ')[0] : '');
  const lastName = user ? user.nom : (displayUser.name ? displayUser.name.split(' ')[1] : '');
  const fullName = user ? `${user.prenom} ${user.nom}` : (displayUser.name || 'User');
  const initials = user ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() : (displayUser.initials || 'U');
  
  const displayRole = displayUser.role === 'admin' ? 'Administrateur' : (displayUser.role === 'professeur' ? 'Professeur' : displayUser.role);

  return (
    <aside className="sidebar">

      {/* ── Logo ── */}
      <div className="sidebar-logo-wrap">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <IconBuilding />
          </div>
          <div className="sidebar-logo-text-wrap">
            <div className="sidebar-logo-name">IPSAS</div>
            <div className="sidebar-logo-sub">
              {logoSub.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="sidebar-badge">Menu</p>

      {/* ── Nav items ── */}
      <nav className="sidebar-nav" aria-label="Navigation principale">
        {navItems.map(({ id, label, Icon, path }) => (
          <NavLink
            key={id}
            id={`nav-${id}`}
            to={path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer utilisateur ── */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar" aria-hidden="true">{initials}</div>
          <div>
            <div className="user-info-name">{fullName}</div>
            <div className="user-info-role">{displayRole}</div>
          </div>
        </div>
        <button className="btn-logout" id="btn-sidebar-logout" onClick={onLogout}>
          <IconLogout />
          Déconnexion
        </button>
      </div>

    </aside>
  );
}

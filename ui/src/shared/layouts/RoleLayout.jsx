import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function RoleLayout({ title, basePath, extraLinks = [] }) {
  const navigate = useNavigate();
  const { user, role, loading, logout } = useAuthStore();

  const links = [
    { label: 'Dashboard', to: basePath, end: true },
    ...extraLinks,
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="page">
      {/* Sidebar */}
      <aside className="navbar navbar-vertical navbar-expand-lg">
        <div className="container-fluid">
          <h1 className="navbar-brand m-0">
            <div className="small text-uppercase fw-semibold">Imohon</div>
            <span className="fs-5">{title}</span>
          </h1>
          <div className="collapse navbar-collapse" id="navbar-menu">
            <ul className="navbar-nav pt-lg-3">
              {links.map((link) => (
                <li className="nav-item" key={link.to}>
                  <NavLink
                    end={link.end}
                    to={link.to}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" /><line x1="12" y1="12" x2="20" y2="7.5" /><line x1="12" y1="12" x2="12" y2="21" /><line x1="12" y1="12" x2="4" y2="7.5" /></svg>
                    </span>
                    <span className="nav-link-title">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="page-wrapper">
        <header className="content-navbar">
          <div>
            <div className="content-navbar-eyebrow">Imohon</div>
            <div className="content-navbar-title">{title}</div>
          </div>
          <div className="content-navbar-actions">
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-icon btn-outline-secondary content-navbar-profile"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Open user menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </button>
              <div className="dropdown-menu dropdown-menu-end content-navbar-menu">
                <div className="content-navbar-user">
                  <span className="fw-semibold">{user?.name}</span>
                  <span>{user?.email}</span>
                  <span>
                    Role: <span className="badge bg-primary">{role}</span>
                  </span>
                </div>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item text-danger"
                  disabled={loading}
                  onClick={handleLogout}
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="page-body">
          <div className="app-shell">
            <div className="card">
              <div className="card-body">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

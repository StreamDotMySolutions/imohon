import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

function SidebarIcon({ label }) {
  const iconProps = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '16',
    height: '16',
    fill: 'currentColor',
    viewBox: '0 0 16 16',
    className: 'bi',
    'aria-hidden': 'true',
  };

  switch (label) {
    case 'Dashboard':
      return (
        <svg {...iconProps}>
          <path d="M0 0h16v16H0z" fill="none" />
          <path d="M0 0h16v16H0z" fill="none" />
          <path d="M0 0h16v16H0z" fill="none" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3.793l2.146 2.147a.5.5 0 0 1-.708.707L7.646 8.854A.5.5 0 0 1 7.5 8.5v-4A.5.5 0 0 1 8 4" />
          <path d="M3.255 5.786a.237.237 0 0 0-.241.247 6.5 6.5 0 1 0 2.034-4.369.237.237 0 0 0 .33.34A6 6 0 1 1 3.504 6.01a.237.237 0 0 0-.25-.224z" />
        </svg>
      );
    case 'Users':
      return (
        <svg {...iconProps}>
          <path d="M13 7a2 2 0 1 0-3.999.001A2 2 0 0 0 13 7M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
          <path d="M1 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm7-1c0-.552-.895-3-4-3s-4 2.448-4 3z" />
          <path d="M14 14s1 0 1-1-1-4-5-4q-.544 0-1.022.07A5.5 5.5 0 0 1 10 13s0 .361-.145 1z" />
        </svg>
      );
    case 'Departments':
      return (
        <svg {...iconProps}>
          <path d="M6.5 6.5v-6h3v6h6v9h-15v-9zm-5.5 1v7h14v-7h-4v-6h-1v6zm4-2h1v1h-1zm0 3h1v1h-1zm0 3h1v1h-1zm5-6h1v1h-1zm0 3h1v1h-1zm0 3h1v1h-1z" />
        </svg>
      );
    case 'Items':
      return (
        <svg {...iconProps}>
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zM13 4h-2a1 1 0 0 1-1-1V1z" />
        </svg>
      );
    case 'Categories':
      return (
        <svg {...iconProps}>
          <path d="M9.828 4a3 3 0 0 1-.828-.117V4a2 2 0 0 1-2 2H6v1h1a3 3 0 0 1 3 3v1.082a3 3 0 1 1-1 0V10a2 2 0 0 0-2-2H6a2 2 0 0 1-2-2V5h-.172A3 3 0 1 1 4 4.918V5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.082A3 3 0 1 1 9.828 4M3 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4m9 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
        </svg>
      );
    case 'Vendors':
      return (
        <svg {...iconProps}>
          <path d="M2 2.5A1.5 1.5 0 0 1 3.5 1h9A1.5 1.5 0 0 1 14 2.5v11a.5.5 0 0 1-.777.416L8 10.202l-5.223 3.714A.5.5 0 0 1 2 13.5zm2.5-.5a.5.5 0 0 0-.5.5V12.53l3.723-2.647a.5.5 0 0 1 .554 0L12 12.53V2.5a.5.5 0 0 0-.5-.5z" />
        </svg>
      );
    case 'Distributions':
      return (
        <svg {...iconProps}>
          <path d="M0 0h16v16H0z" fill="none" />
          <path d="M8.878 1.444a1 1 0 0 0-1.756 0l-6 10A1 1 0 0 0 2 13h12a1 1 0 0 0 .878-1.556zM7.002 5a1 1 0 1 1 2 0l-.35 3.507a.65.65 0 0 1-1.296 0zM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
        </svg>
      );
    case 'Requests':
      return (
        <svg {...iconProps}>
          <path d="M14 4.5V14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1L13 4.5z" />
          <path d="M8 6.5a.5.5 0 0 1 .5.5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0V9h-1a.5.5 0 0 1 0-1h1V7a.5.5 0 0 1 .5-.5" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="8" cy="8" r="3" />
        </svg>
      );
  }
}

export default function RoleLayout({ title, basePath, extraLinks = [], showSidebar = false }) {
  const navigate = useNavigate();
  const { user, role, loading, logout } = useAuthStore();
  const links = [
    { label: 'Dashboard', to: basePath, end: true },
    ...extraLinks,
  ];
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={`page ${showSidebar && sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {showSidebar ? (
        <aside className={`navbar navbar-vertical navbar-expand-lg ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="container-fluid">
            <h1 className="navbar-brand m-0">
              <div className="small text-uppercase fw-semibold">Imohon</div>
              <span className="fs-5">{title}</span>
            </h1>
            <div className="navbar-collapse show collapse" id="sidebarMenu">
              <ul className="navbar-nav pt-lg-3">
                {links.map((link) => (
                  <li className="nav-item" key={link.to}>
                    <NavLink
                      end={link.end}
                      to={link.to}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="nav-link-icon">
                        <SidebarIcon label={link.label} />
                      </span>
                      <span className="nav-link-title">{link.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      ) : null}

      <div className="page-wrapper">
        <header className="content-navbar">
          <div className="d-flex align-items-center gap-3">
            {showSidebar ? (
              <button
                type="button"
                className="btn btn-sm btn-link p-0 text-secondary"
                data-bs-toggle="collapse"
                data-bs-target="#sidebarMenu"
                aria-controls="sidebarMenu"
                aria-expanded={!sidebarCollapsed}
                aria-label="Toggle sidebar"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
              >
                <span className="icon">
                  <i
                    className={`bi ${sidebarCollapsed ? 'bi-x-lg' : 'bi-list'}`}
                    aria-hidden="true"
                    style={{ fontSize: '1rem', lineHeight: 1 }}
                  />
                </span>
              </button>
            ) : null}
            <div>
              <div className="content-navbar-eyebrow">Imohon</div>
              <div className="content-navbar-title">{title}</div>
            </div>
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

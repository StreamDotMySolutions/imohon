import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import FeedbackAlert from '../components/FeedbackAlert';
import { roleRouteMap, useAuthStore } from '../../stores/authStore';

const TEST_ACCOUNTS = [
  { name: 'User', email: 'user@local', role: 'User', department: 'Operations' },
  { name: 'Manager', email: 'manager@local', role: 'Manager', department: 'Operations' },
  { name: 'Admin', email: 'admin@local', role: 'Admin', department: 'HQ' },
  { name: 'General Manager', email: 'generalmanager@local', role: 'GeneralManager', department: 'HQ' },
  { name: 'System', email: 'system@local', role: 'System', department: 'HQ' },
  { name: 'Vendor', email: 'vendor@local', role: 'Vendor', department: 'Vendor' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role, loading, error, clearError, login } = useAuthStore();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  if (isAuthenticated && role) {
    return <Navigate to={roleRouteMap[role] || '/login'} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    clearError();
    setValidationErrors({});
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFillTestAccount = (email) => {
    setForm({
      email,
      password: 'password',
    });
    clearError();
    setValidationErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const authenticatedUser = await login(form);
      const destination = roleRouteMap[authenticatedUser?.role] || '/login';

      navigate(destination, { replace: true });
    } catch (submitError) {
      setValidationErrors(submitError.errors || {});
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="content-card card">
            <div className="card-body p-4 p-lg-5">
              <div className="mb-4">
                <div className="small text-uppercase text-secondary fw-semibold mb-2">Imohon</div>
                <h1 className="h3 mb-1">Login</h1>
                <p className="text-secondary mb-0">
                  Sign in with your Laravel account through Sanctum SPA authentication.
                </p>
              </div>

              {error ? <FeedbackAlert message={error} /> : null}

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                    placeholder="name@example.com"
                  />
                  <div className="invalid-feedback">{validationErrors.email?.[0]}</div>
                </div>

                <div className="col-12">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                  />
                  <div className="invalid-feedback">{validationErrors.password?.[0]}</div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>

              {import.meta.env.VITE_APP_MODE === 'development' && (
                <div className="mt-4 pt-4 border-top">
                  <p className="text-secondary small mb-3">
                    <strong>Development Mode:</strong> Click to auto-fill credentials
                  </p>
                  <div className="d-grid gap-2">
                    {TEST_ACCOUNTS.map((account) => (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => handleFillTestAccount(account.email)}
                        className="btn btn-outline-secondary btn-sm text-start"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{account.name}</strong>
                            <div className="small text-muted">{account.email}</div>
                          </div>
                          <div className="small badge login-role-badge">{account.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

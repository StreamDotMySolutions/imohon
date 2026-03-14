import React from 'react';
import { roleOptions } from '../../../../shared/constants/roles';
import { Link } from 'react-router-dom';

export default function UserForm({
  form,
  departments = [],
  onChange,
  onSubmit,
  saving,
  submitLabel,
  validationErrors = {},
  mode = 'create',
}) {
  const inputClass = (name) =>
    `form-control ${validationErrors[name] ? 'is-invalid' : ''}`.trim();

  const selectClass = (name) =>
    `form-select ${validationErrors[name] ? 'is-invalid' : ''}`.trim();

  const firstError = (name) => validationErrors[name]?.[0];

  return (
    <form onSubmit={onSubmit} className="row g-4">
      <div className="col-md-6">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input id="name" name="name" value={form.name} onChange={onChange} className={inputClass('name')} />
        <div className="invalid-feedback">{firstError('name')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          className={inputClass('email')}
        />
        <div className="invalid-feedback">{firstError('email')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="role" className="form-label">
          Role
        </label>
        <select id="role" name="role" value={form.role} onChange={onChange} className={selectClass('role')}>
          <option value="">Select a role</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{firstError('role')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="department_id" className="form-label">
          Department
        </label>
        <select
          id="department_id"
          name="department_id"
          value={form.department_id}
          onChange={onChange}
          className={selectClass('department_id')}
        >
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department.value} value={department.value}>
              {department.label} ({department.type})
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{firstError('department_id')}</div>
        <div className="form-hint mt-2">
          Manage departments in the{' '}
          <Link to="/admin/departments" className="link-primary">
            departments module
          </Link>
          .
        </div>
      </div>

      <div className="col-md-6">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          className={inputClass('password')}
          placeholder={mode === 'edit' ? 'Leave blank to keep current password' : ''}
        />
        <div className="invalid-feedback">{firstError('password')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="password_confirmation" className="form-label">
          Confirm Password
        </label>
        <input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          value={form.password_confirmation}
          onChange={onChange}
          className="form-control"
        />
      </div>

      <div className="col-12">
        <div className="form-check form-switch">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={onChange}
            className="form-check-input"
          />
          <label htmlFor="is_active" className="form-check-label">
            Active account
          </label>
        </div>
      </div>

      <div className="col-12 d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

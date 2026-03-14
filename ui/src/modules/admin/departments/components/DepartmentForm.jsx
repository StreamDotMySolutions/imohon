import React from 'react';

const typeOptions = ['HQ', 'REGULAR', 'VENDOR'];

export default function DepartmentForm({
  form,
  onChange,
  onSubmit,
  saving,
  submitLabel,
  validationErrors = {},
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
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          className={inputClass('name')}
          placeholder="Department name"
        />
        <div className="invalid-feedback">{firstError('name')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="type" className="form-label">
          Type
        </label>
        <select id="type" name="type" value={form.type} onChange={onChange} className={selectClass('type')}>
          <option value="">Select a type</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{firstError('type')}</div>
      </div>

      <div className="col-12 d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

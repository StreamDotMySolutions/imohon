import React from 'react';

export default function CategoryForm({
  form,
  onChange,
  onSubmit,
  saving,
  submitLabel,
  validationErrors = {},
  parentOptions = [],
  showParentSelect = true,
  showTypeSelector = false,
}) {
  const inputClassName = (field) => `form-control ${validationErrors[field] ? 'is-invalid' : ''}`.trim();
  const selectClassName = (field) => `form-select ${validationErrors[field] ? 'is-invalid' : ''}`.trim();
  const firstError = (field) => validationErrors[field]?.[0];

  const typeOptions = [
    { label: 'Folder', value: 'folder' },
    { label: 'Item', value: 'item' },
  ];

  return (
    <form onSubmit={onSubmit} className="row g-4">
      {showTypeSelector && (
        <div className="col-md-6">
          <label htmlFor="type" className="form-label">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={onChange}
            className={selectClassName('type')}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{firstError('type')}</div>
        </div>
      )}

      <div className="col-md-6">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          className={inputClassName('name')}
          placeholder="Category name"
        />
        <div className="invalid-feedback">{firstError('name')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="slug" className="form-label">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          value={form.slug}
          onChange={onChange}
          className={inputClassName('slug')}
          placeholder="category-slug"
        />
        <div className="invalid-feedback">{firstError('slug')}</div>
      </div>

      <div className="col-12">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={onChange}
          className={inputClassName('description')}
          rows={3}
          placeholder="Optional details about this category"
        />
        <div className="invalid-feedback">{firstError('description')}</div>
      </div>

      {showParentSelect && (
        <div className="col-md-6">
          <label htmlFor="parent_id" className="form-label">
            Parent category
          </label>
          <select
            id="parent_id"
            name="parent_id"
            value={form.parent_id || ''}
            onChange={onChange}
            className={selectClassName('parent_id')}
          >
            <option value="">No parent (root)</option>
            {parentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {'\u00A0'.repeat(option.depth * 2)}
                {option.name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{firstError('parent_id')}</div>
        </div>
      )}

      {!showParentSelect && (
        <input type="hidden" name="parent_id" value="" />
      )}

      <div className="col-md-6">
        <div className="form-check form-switch mt-4">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            className="form-check-input"
            checked={Boolean(form.is_active)}
            onChange={(event) =>
              onChange({
                target: {
                  name: 'is_active',
                  value: event.target.checked,
                  type: 'checkbox',
                  checked: event.target.checked,
                },
              })
            }
          />
          <label htmlFor="is_active" className="form-check-label">
            Active
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

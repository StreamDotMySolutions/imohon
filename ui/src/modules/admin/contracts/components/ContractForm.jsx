import React from 'react';

export default function ContractForm({
  form,
  onChange,
  onSubmit,
  saving,
  validationErrors = {},
  vendorOptions = [],
  categoryOptions = [],
}) {
  const inputClassName = (field) => `form-control ${validationErrors[field] ? 'is-invalid' : ''}`.trim();
  const selectClassName = (field) => `form-select ${validationErrors[field] ? 'is-invalid' : ''}`.trim();
  const firstError = (field) => validationErrors[field]?.[0];

  return (
    <form onSubmit={onSubmit} className="row g-3">
      <div className="col-md-6">
        <label htmlFor="contract_number" className="form-label">
          Contract number
        </label>
        <input
          id="contract_number"
          name="contract_number"
          value={form.contract_number}
          onChange={onChange}
          className={inputClassName('contract_number')}
          placeholder="e.g., CT-1001"
        />
        <div className="invalid-feedback">{firstError('contract_number')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="vendor_id" className="form-label">
          Registered vendor
        </label>
        <select
          id="vendor_id"
          name="vendor_id"
          value={form.vendor_id || ''}
          onChange={onChange}
          className={selectClassName('vendor_id')}
        >
          <option value="">Manual vendor</option>
          {vendorOptions.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{firstError('vendor_id')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="vendor_name" className="form-label">
          Vendor name
        </label>
        <input
          id="vendor_name"
          name="vendor_name"
          value={form.vendor_name}
          onChange={onChange}
          className={inputClassName('vendor_name')}
          placeholder="Name used for this contract"
        />
        <div className="invalid-feedback">{firstError('vendor_name')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="category_id" className="form-label">
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          value={form.category_id || ''}
          onChange={onChange}
          className={selectClassName('category_id')}
        >
          <option value="">Select a category</option>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{firstError('category_id')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="total" className="form-label">
          Total units
        </label>
        <input
          id="total"
          name="total"
          type="number"
          min="0"
          value={form.total}
          onChange={onChange}
          className={inputClassName('total')}
        />
        <div className="invalid-feedback">{firstError('total')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="date_start" className="form-label">
          Start date
        </label>
        <input
          id="date_start"
          name="date_start"
          type="date"
          value={form.date_start || ''}
          onChange={onChange}
          className={inputClassName('date_start')}
        />
        <div className="invalid-feedback">{firstError('date_start')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="date_end" className="form-label">
          End date
        </label>
        <input
          id="date_end"
          name="date_end"
          type="date"
          value={form.date_end || ''}
          onChange={onChange}
          className={inputClassName('date_end')}
        />
        <div className="invalid-feedback">{firstError('date_end')}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor="date_delivery" className="form-label">
          Delivery date
        </label>
        <input
          id="date_delivery"
          name="date_delivery"
          type="date"
          value={form.date_delivery || ''}
          onChange={onChange}
          className={inputClassName('date_delivery')}
        />
        <div className="invalid-feedback">{firstError('date_delivery')}</div>
      </div>

      <div className="col-md-6 d-flex align-items-center">
        <div className="form-check form-switch">
          <input
            id="active"
            name="active"
            type="checkbox"
            className="form-check-input"
            checked={Boolean(form.active)}
            onChange={(event) =>
              onChange({
                target: {
                  name: 'active',
                  value: event.target.checked,
                  type: 'checkbox',
                  checked: event.target.checked,
                },
              })
            }
          />
          <label htmlFor="active" className="form-check-label">
            Active
          </label>
        </div>
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save contract'}
        </button>
      </div>
    </form>
  );
}

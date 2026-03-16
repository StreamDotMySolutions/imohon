import React from 'react';
import ItemStatusPill from './ItemStatusPill';

export default function ItemsTable({ items, onEditClick }) {
  if (!items.length) {
    return (
      <div className="text-center py-5 text-secondary">
        No items found.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Reference ID</th>
            <th>Category</th>
            <th>Vendor</th>
            <th>Contract</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Updated</th>
            <th style={{ width: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <small className="text-muted font-monospace">{item.reference_id || '-'}</small>
              </td>
              <td>
                <div className="fw-semibold">{item.category_name || '-'}</div>
              </td>
              <td>{item.vendor_name || '-'}</td>
              <td>
                <small className="text-muted">{item.contract_number || '-'}</small>
              </td>
              <td>
                <ItemStatusPill status={item.status} />
              </td>
              <td>
                <small className="text-muted">
                  {item.notes ? item.notes.substring(0, 40) : '-'}
                  {item.notes && item.notes.length > 40 ? '...' : ''}
                </small>
              </td>
              <td>
                <small className="text-muted">{item.updated_at || '-'}</small>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onEditClick(item)}
                >
                  Edit Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

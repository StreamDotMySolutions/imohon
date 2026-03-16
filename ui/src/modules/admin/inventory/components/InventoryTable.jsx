import React from 'react';

export default function InventoryTable({ inventories }) {
  if (!inventories.length) {
    return (
      <div className="text-center py-5 text-secondary">
        No inventory items found.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Category</th>
            <th>Vendor</th>
            <th>Contract</th>
            <th>Qty</th>
            <th>Reference</th>
            <th>Description</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {inventories.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="fw-semibold">{item.category_name || '-'}</div>
              </td>
              <td>{item.vendor_name || '-'}</td>
              <td>
                <small className="text-muted">{item.contract_number || '-'}</small>
              </td>
              <td>
                <span className="badge bg-info text-dark">{item.total}</span>
              </td>
              <td>
                <small className="text-muted">{item.reference_number || '-'}</small>
              </td>
              <td>
                <small className="text-muted">
                  {item.description ? item.description.substring(0, 50) : '-'}
                </small>
              </td>
              <td>
                <small className="text-muted">{item.updated_at || '-'}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

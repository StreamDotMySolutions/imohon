import React from 'react';
import { Link } from 'react-router-dom';
import StatusPill from '../../../../shared/components/StatusPill';

export default function ContractTable({ contracts, onDelete, onToggleStatus }) {
  if (!contracts.length) {
    return (
      <div className="text-center py-5 text-secondary">
        No contracts yet. Start by creating one.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Contract</th>
            <th>Vendor</th>
            <th>Items</th>
            <th>Dates</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id}>
              <td>
                <div className="fw-semibold">{contract.contract_number}</div>
                <small className="text-muted">{contract.created_at}</small>
              </td>
              <td>{contract.vendor?.name || '-'}</td>
              <td>
                {contract.items && contract.items.length > 0 ? (
                  <div>
                    <div>{contract.items.length} item(s)</div>
                    <small className="text-muted">
                      {contract.items.map((item) => item.category_name).join(', ')}
                    </small>
                  </div>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
              <td>
                <div className="small text-muted">
                  Start: {contract.date_start || '-'}
                </div>
                <div className="small text-muted">
                  Delivery: {contract.date_delivery || contract.date_end || '-'}
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <StatusPill active={contract.active} />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => onToggleStatus(contract)}
                  >
                    <i className="bi bi-arrow-repeat" aria-hidden="true" />
                  </button>
                </div>
              </td>
              <td className="text-end">
                <div className="btn-group btn-group-sm" role="group">
                  <Link to={`/admin/contracts/${contract.id}`} className="btn btn-outline-secondary">
                    View
                  </Link>
                  <Link to={`/admin/contracts/${contract.id}/edit`} className="btn btn-outline-primary">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => onDelete(contract)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

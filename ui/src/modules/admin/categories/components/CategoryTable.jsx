import React from 'react';
import { Link } from 'react-router-dom';
import StatusPill from '../../../../shared/components/StatusPill';

export default function CategoryTable({ categories, onDelete, onReorder }) {
  if (!categories.length) {
    return (
      <div className="text-center py-5 text-secondary">
        No categories yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Parent</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
            <th className="text-end">Order</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                {category.depth > 0 ? (
                  <span className="text-muted me-1">{'\u00A0'.repeat(category.depth * 2)}↳</span>
                ) : null}
                {category.name}
              </td>
              <td>{category.slug}</td>
              <td>{category.description || '-'}</td>
              <td>{category.parent_name || '-'}</td>
              <td>
                <StatusPill active={category.is_active} />
              </td>
              <td className="text-end">
                <div className="btn-group">
                  <Link to={`/admin/categories/${category.id}`} className="btn btn-sm btn-outline-secondary">
                    View
                  </Link>
                  <Link to={`/admin/categories/${category.id}/edit`} className="btn btn-sm btn-outline-primary">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(category.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
              <td className="text-end">
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => onReorder(category.id, 'up')}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => onReorder(category.id, 'down')}
                  >
                    ↓
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

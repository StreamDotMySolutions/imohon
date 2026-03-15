import React from 'react';
import { Link } from 'react-router-dom';
import StatusPill from '../../../../shared/components/StatusPill';

export default function CategoryTable({ categories, orderingCategoryId, onDelete, onReorder }) {
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
            <th>Type</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>
                {category.depth > 0 ? (
                  <span className="text-muted me-1">{'\u00A0'.repeat(category.depth * 2)}- </span>
                ) : null}
                {category.type === 'folder' ? (
                  <Link
                    to={`/admin/categories?parent_id=${category.id}`}
                    className="fw-semibold text-decoration-none"
                  >
                    {category.name}
                    <span className="text-muted ms-1">
                      ({category.children_count ?? 0})
                    </span>
                  </Link>
                ) : (
                  category.name
                )}
              </td>
              <td>
                {category.type === 'folder' ? (
                  <Link
                    to={`/admin/categories?parent_id=${category.id}`}
                    className="d-inline-flex align-items-center gap-1 text-decoration-none"
                    title="Folder"
                    aria-label="Folder"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-sm"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-10a2 2 0 0 0 -2 -2h-8l-2 -3h-4a2 2 0 0 0 -2 2z" />
                    </svg>
                    <span>Folder</span>
                  </Link>
                ) : category.type === 'item' ? (
                  <span className="d-inline-flex align-items-center gap-1" title="Item" aria-label="Item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-sm"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 3h8l4 4v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2" />
                      <path d="M15 3v4a2 2 0 0 0 2 2h4" />
                    </svg>
                    <span>Item</span>
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <StatusPill active={category.is_active} />
              </td>
              <td className="text-end">
                <div className="btn-group btn-group-sm me-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled={orderingCategoryId === category.id || index === 0}
                    onClick={() => onReorder(category.id, 'up')}
                  >
                    <i className="bi bi-arrow-up" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled={orderingCategoryId === category.id || index === categories.length - 1}
                    onClick={() => onReorder(category.id, 'down')}
                  >
                    <i className="bi bi-arrow-down" aria-hidden="true" />
                  </button>
                </div>
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
                    onClick={() => onDelete(category)}
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

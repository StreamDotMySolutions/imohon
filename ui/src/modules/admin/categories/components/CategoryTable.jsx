import React from 'react';
import { Link } from 'react-router-dom';
import StatusPill from '../../../../shared/components/StatusPill';

export default function CategoryTable({ categories, orderingCategoryId, onDelete, onReorder, onToggleStatus, pagination = {} }) {
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
          {categories.map((category, index) => {
            const depth = category.depth || 0;
            const isFirstOverall = index === 0 && (pagination?.current_page === 1 || pagination?.current_page === undefined);
            const isLastOverall = index === categories.length - 1 && (pagination?.current_page === pagination?.last_page || pagination?.last_page === undefined);

            const hasPreviousSibling = (() => {
              // If not first in array, definitely has previous sibling
              if (index > 0) {
                const candidate = categories[index - 1];
                const candidateDepth = candidate.depth || 0;
                if (candidateDepth === depth && candidate.parent_id === category.parent_id) {
                  return true;
                }
              }

              // If on page 1 and first in array, check the rest of the array
              if (isFirstOverall) {
                for (let pointer = 1; pointer < categories.length; pointer += 1) {
                  const candidate = categories[pointer];
                  const candidateDepth = candidate.depth || 0;

                  if (candidateDepth > depth) {
                    continue;
                  }

                  if (candidateDepth < depth) {
                    break;
                  }

                  if (candidate.parent_id === category.parent_id) {
                    return false; // Found another sibling, so first item doesn't have previous
                  }
                }
                return false;
              }

              // If not first overall, there are definitely siblings before
              return !isFirstOverall;
            })();
            const hasNextSibling = (() => {
              // If not last in array, check for next sibling in current page
              if (index < categories.length - 1) {
                const candidate = categories[index + 1];
                const candidateDepth = candidate.depth || 0;
                if (candidateDepth === depth && candidate.parent_id === category.parent_id) {
                  return true;
                }
              }

              // If on last page and last in array, no next sibling
              if (isLastOverall) {
                return false;
              }

              // If not on last page, there are more items that could be siblings
              return !isLastOverall;
            })();

            return (
              <tr key={category.id}>
                <td
                  className="category-name-cell text-start"
           
                >
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
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={category.is_active}
                      aria-label="Toggle status"
                      onChange={() => onToggleStatus(category)}
                    />
                    <label className="form-check-label ms-1">
                      {category.is_active ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm me-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={orderingCategoryId === category.id || !hasPreviousSibling}
                      onClick={() => onReorder(category.id, 'up')}
                    >
                      <i className="bi bi-arrow-up" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={orderingCategoryId === category.id || !hasNextSibling}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

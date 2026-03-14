import React from 'react';

function buildPageItems(currentPage, lastPage) {
  if (!lastPage || lastPage <= 1) {
    return [1];
  }

  const pages = new Set([1, lastPage, currentPage, currentPage - 1, currentPage + 1]);
  const visiblePages = Array.from(pages)
    .filter((page) => page >= 1 && page <= lastPage)
    .sort((left, right) => left - right);

  const items = [];

  visiblePages.forEach((page, index) => {
    const previousPage = visiblePages[index - 1];

    if (index > 0 && previousPage + 1 < page) {
      items.push(`ellipsis-${previousPage}-${page}`);
    }

    items.push(page);
  });

  return items;
}

export default function Pagination({
  pagination,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 15, 25, 50, 100],
}) {
  if (!pagination || !pagination.total) {
    return null;
  }

  const currentPage = pagination.current_page || 1;
  const lastPage = pagination.last_page || 1;
  const perPage = pagination.per_page || perPageOptions[0];
  const from = pagination.from || 0;
  const to = pagination.to || 0;
  const pageItems = buildPageItems(currentPage, lastPage);

  return (
    <div className="app-pagination">
      <div className="app-pagination-summary">
        <span>
          Showing {from}-{to} of {pagination.total}
        </span>
        <label className="app-pagination-per-page">
          <span>Items per page</span>
          <select
            className="form-select form-select-sm"
            value={perPage}
            onChange={(event) => onPerPageChange(Number(event.target.value))}
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav aria-label="Pagination">
        <ul className="pagination pagination-sm mb-0 app-pagination-list">
          <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
          </li>

          {pageItems.map((item) => (
            typeof item === 'string' ? (
              <li className="page-item disabled" key={item}>
                <span className="page-link">...</span>
              </li>
            ) : (
              <li className={`page-item ${item === currentPage ? 'active' : ''}`} key={item}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() => onPageChange(item)}
                  aria-current={item === currentPage ? 'page' : undefined}
                >
                  {item}
                </button>
              </li>
            )
          ))}

          <li className={`page-item ${currentPage >= lastPage ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= lastPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

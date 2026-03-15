import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../../../shared/components/ConfirmModal';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import Pagination from '../../../../shared/components/Pagination';
import CategoryTable from '../components/CategoryTable';
import { useAdminCategoriesStore } from '../store/adminCategoriesStore';

export default function AdminCategoriesIndexPage() {
  const {
    categories,
    pagination,
    loading,
    orderingCategoryId,
    error,
    filters,
    fetchCategories,
    deleteCategory,
    orderCategory,
    fetchAllCategories,
    allCategories,
  } = useAdminCategoriesStore();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(filters?.search ?? '');

  useEffect(() => {
    const parentId = searchParams.get('parent_id') ?? '';
    const search = searchParams.get('search') ?? '';

    fetchCategories({ parent_id: parentId, search, page: 1 });
    fetchAllCategories();
  }, [fetchCategories, fetchAllCategories, searchParams]);

  useEffect(() => {
    setSearchTerm(filters?.search ?? '');
  }, [filters?.search]);

  useEffect(() => {
    const normalizedSearch = searchTerm.trim();
    const activeSearch = filters?.search ?? '';

    if (normalizedSearch === activeSearch) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (normalizedSearch) {
          nextParams.set('search', normalizedSearch);
        } else {
          nextParams.delete('search');
        }

        return nextParams;
      });

      fetchCategories({ page: 1, search: normalizedSearch });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [fetchCategories, filters?.search, searchTerm]);

  const parentOptions = useMemo(() => {
    const options = [{ label: 'Top level', value: '' }];

    return options.concat(
      allCategories
        .filter((category) => category.type === 'folder')
        .map((category) => ({
          value: category.id,
          label: `${'\u00A0'.repeat((category.depth || 0) * 2)}${category.name}`,
        })),
    );
  }, [allCategories]);

  const parentFilterValue = filters?.parent_id ?? '';
  const categoryMap = useMemo(
    () => new Map(allCategories.map((category) => [String(category.id), category])),
    [allCategories],
  );
  const breadcrumbItems = useMemo(() => {
    const items = [{ label: 'Root', value: '' }];

    if (!parentFilterValue) {
      return items;
    }

    const chain = [];
    let cursor = categoryMap.get(String(parentFilterValue));

    while (cursor) {
      chain.unshift({
        label: cursor.name,
        value: String(cursor.id),
      });

      if (!cursor.parent_id) {
        break;
      }

      cursor = categoryMap.get(String(cursor.parent_id));
    }

    return items.concat(chain);
  }, [categoryMap, parentFilterValue]);
  const createHref =
    parentFilterValue ? `/admin/categories/create?parent_id=${parentFilterValue}` : '/admin/categories/create';

  const handlePageChange = (page) => {
    fetchCategories({ page });
  };

  const handlePerPageChange = (perPage) => {
    fetchCategories({ page: 1, per_page: perPage });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    await deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleReorder = async (categoryId, direction) => {
    await orderCategory(categoryId, direction);
  };

  const handleStatusToggle = async (category) => {
    await updateCategory(category.id, { is_active: !category.is_active });
  };

  const handleParentChange = (event) => {
    const parentValue = event.target.value;
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (parentValue) {
        nextParams.set('parent_id', parentValue);
      } else {
        nextParams.delete('parent_id');
      }

      return nextParams;
    });
    fetchCategories({ page: 1, parent_id: parentValue });
  };

  return (
    <div>
      <PageHeader
        title="categories.index"
        description="Manage product categories and their hierarchy."
        actionsClassName="category-page-header-actions"
        actions={
          <div className="category-header-actions">
            <Link to={createHref} className="btn btn-primary">
              Create category
            </Link>
            <input
              type="search"
              className="form-control category-header-search"
              placeholder="Search categories"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <div className="category-toolbar mb-3">
        <div className="category-toolbar-cell">
          <div className="category-breadcrumb" aria-label="Category path">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={`${item.value || 'root'}-${index}`}>
                {index > 0 ? <span className="category-breadcrumb-separator">{'>'}</span> : null}
                {index === breadcrumbItems.length - 1 ? (
                  <span className="category-breadcrumb-current">{item.label}</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link category-breadcrumb-link"
                    onClick={() => {
                      setSearchParams((currentParams) => {
                        const nextParams = new URLSearchParams(currentParams);

                        if (item.value) {
                          nextParams.set('parent_id', item.value);
                        } else {
                          nextParams.delete('parent_id');
                        }

                        return nextParams;
                      });
                      fetchCategories({ page: 1, parent_id: item.value });
                    }}
                  >
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="category-toolbar-cell">
          <label className="d-flex align-items-center gap-2 mb-0">
            Parent:
            <select
              className="form-select form-select-sm"
              value={parentFilterValue}
              onChange={handleParentChange}
            >
              {parentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="category-toolbar-cell category-toolbar-cell-end">
          <span className="text-secondary small">
            Showing {categories.length} item{categories.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingBlock message="Loading categories..." />
      ) : (
        <>
          <CategoryTable
            categories={categories}
            orderingCategoryId={orderingCategoryId}
            onDelete={setDeleteTarget}
            onReorder={handleReorder}
            onToggleStatus={handleStatusToggle}
          />
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete category"
        message={
          deleteTarget
            ? deleteTarget.type === 'folder'
              ? `Deleting "${deleteTarget.name}" will remove ${((deleteTarget.descendants_count ?? 0) + 1).toString()} categories (including children). Continue?`
              : `Delete "${deleteTarget.name}"? This action cannot be undone.`
            : 'Delete this category?'
        }
        confirmLabel="Delete category"
        confirming={loading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

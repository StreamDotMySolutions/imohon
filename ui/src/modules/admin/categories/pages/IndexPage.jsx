import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
    error,
    filters,
    fetchCategories,
    deleteCategory,
    orderCategory,
    fetchAllCategories,
    allCategories,
  } = useAdminCategoriesStore();
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchAllCategories();
  }, [fetchCategories, fetchAllCategories]);

  const parentOptions = useMemo(() => {
    const options = [
      { label: 'All parents', value: '' },
      { label: 'Root (no parent)', value: 'root' },
    ];

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

    await deleteCategory(deleteTarget);
    setDeleteTarget(null);
  };

  const handleReorder = async (categoryId, direction) => {
    await orderCategory(categoryId, direction);
  };

  const handleParentChange = (event) => {
    const parentValue = event.target.value;
    fetchCategories({ page: 1, parent_id: parentValue });
  };

  return (
    <div>
      <PageHeader
        title="categories.index"
        description="Manage product categories and their hierarchy."
        actions={
          <Link to="/admin/categories/create" className="btn btn-primary">
            Create category
          </Link>
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <div className="d-flex gap-3 align-items-center mb-3">
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

      {loading ? (
        <LoadingBlock message="Loading categories..." />
      ) : (
        <>
          <CategoryTable categories={categories} onDelete={setDeleteTarget} onReorder={handleReorder} />
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
        message="Delete this category? This action cannot be undone."
        confirmLabel="Delete category"
        confirming={loading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

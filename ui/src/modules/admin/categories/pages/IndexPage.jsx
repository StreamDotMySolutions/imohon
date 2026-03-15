import React, { useEffect, useState } from 'react';
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
    fetchCategories,
    deleteCategory,
    orderCategory,
  } = useAdminCategoriesStore();
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

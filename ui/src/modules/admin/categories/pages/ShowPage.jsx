import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import ConfirmModal from '../../../../shared/components/ConfirmModal';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import StatusPill from '../../../../shared/components/StatusPill';
import { useAdminCategoriesStore } from '../store/adminCategoriesStore';

export default function AdminCategoriesShowPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { selectedCategory, loading, error, fetchCategory, deleteCategory } = useAdminCategoriesStore();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetchCategory(categoryId);
  }, [fetchCategory, categoryId]);

  const handleDelete = async () => {
    await deleteCategory(categoryId);
    setDeleteOpen(false);
    navigate('/admin/categories');
  };

  if (loading && !selectedCategory) {
    return <LoadingBlock message="Loading category..." />;
  }

  if (!selectedCategory) {
    return <FeedbackAlert message={error || 'Category not found.'} />;
  }

  return (
    <div>
      <PageHeader
        title="categories.show"
        description="Inspect and manage this category."
        actions={
          <>
            <Link to={`/admin/categories/${categoryId}/edit`} className="btn btn-primary">
              Edit category
            </Link>
            <BackLink to="/admin/categories" />
          </>
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table mb-0">
              <tbody>
                <tr>
                  <th className="text-secondary">Name</th>
                  <td>{selectedCategory.name}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Slug</th>
                  <td>{selectedCategory.slug}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Description</th>
                  <td>{selectedCategory.description || '-'}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Parent</th>
                  <td>{selectedCategory.parent_name || 'Root'}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Type</th>
                  <td className="text-capitalize">{selectedCategory.type}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Status</th>
                  <td>
                    <StatusPill active={selectedCategory.is_active} />
                  </td>
                </tr>
                <tr>
                  <th className="text-secondary">Depth</th>
                  <td>{selectedCategory.depth}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Created</th>
                  <td>{selectedCategory.created_at}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Updated</th>
                  <td>{selectedCategory.updated_at}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 bg-body-tertiary">
            <div className="card-body">
              <h2 className="h5">Resource actions</h2>
              <p className="text-secondary">
                This page reflects the `/admin/categories` payload directly.
              </p>
              <button type="button" className="btn btn-outline-danger" onClick={() => setDeleteOpen(true)}>
                Delete category
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete category"
        message="Delete this category? This action cannot be undone."
        confirmLabel="Delete category"
        confirming={loading}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../../../shared/components/ConfirmModal';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import Pagination from '../../../../shared/components/Pagination';
import DepartmentTable from '../components/DepartmentTable';
import { useAdminDepartmentsStore } from '../store/adminDepartmentsStore';

export default function AdminDepartmentsIndexPage() {
  const { departments, pagination, loading, error, fetchDepartments, deleteDepartment } = useAdminDepartmentsStore();
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    await deleteDepartment(deleteTarget);
    setDeleteTarget(null);
  };

  return (
    <div>
      <PageHeader
        title="departments.index"
        description="Manage departments used by the admin user management flow."
        actions={
          <Link to="/admin/departments/create" className="btn btn-primary">
            Create department
          </Link>
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      {loading ? (
        <LoadingBlock message="Loading departments..." />
      ) : (
        <>
          <DepartmentTable departments={departments} onDelete={setDeleteTarget} />
          <Pagination
            pagination={pagination}
            onPageChange={(page) => fetchDepartments({ page })}
            onPerPageChange={(perPage) => fetchDepartments({ page: 1, per_page: perPage })}
          />
        </>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete department"
        message="Delete this department? This action cannot be undone."
        confirmLabel="Delete department"
        confirming={loading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

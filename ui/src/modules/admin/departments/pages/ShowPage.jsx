import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import ConfirmModal from '../../../../shared/components/ConfirmModal';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import { useAdminDepartmentsStore } from '../store/adminDepartmentsStore';

export default function AdminDepartmentsShowPage() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const {
    selectedDepartment,
    loading,
    error,
    validationErrors,
    fetchDepartment,
    deleteDepartment,
  } = useAdminDepartmentsStore();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetchDepartment(departmentId);
  }, [fetchDepartment, departmentId]);

  const handleDelete = async () => {
    await deleteDepartment(departmentId);
    setDeleteOpen(false);
    navigate('/admin/departments');
  };

  if (loading && !selectedDepartment) {
    return <LoadingBlock message="Loading department..." />;
  }

  if (!selectedDepartment) {
    return <FeedbackAlert message={error || 'Department not found.'} />;
  }

  return (
    <div>
      <PageHeader
        title="departments.show"
        description="Inspect the department payload and its current user linkage."
        actions={
          <>
            <Link to={`/admin/departments/${departmentId}/edit`} className="btn btn-primary">
              Edit department
            </Link>
            <BackLink to="/admin/departments" />
          </>
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}
      {validationErrors.department?.[0] ? <FeedbackAlert message={validationErrors.department[0]} /> : null}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table mb-0">
              <tbody>
                <tr>
                  <th className="text-secondary">Name</th>
                  <td>{selectedDepartment.name}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Type</th>
                  <td>{selectedDepartment.type}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Assigned users</th>
                  <td>{selectedDepartment.users_count}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Created</th>
                  <td>{selectedDepartment.created_at || '-'}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Updated</th>
                  <td>{selectedDepartment.updated_at || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 bg-body-tertiary">
            <div className="card-body">
              <h2 className="h5">Department actions</h2>
              <p className="text-secondary">
                Departments are linked directly to users through the admin user form.
              </p>
              <Link to="/admin/users/create" className="btn btn-outline-primary me-2">
                Create user
              </Link>
              <button type="button" className="btn btn-outline-danger" onClick={() => setDeleteOpen(true)}>
                Delete department
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete department"
        message="Delete this department? This action cannot be undone."
        confirmLabel="Delete department"
        confirming={loading}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}

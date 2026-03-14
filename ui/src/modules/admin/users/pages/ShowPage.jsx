import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import ConfirmModal from '../../../../shared/components/ConfirmModal';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import StatusPill from '../../../../shared/components/StatusPill';
import { useAdminUsersStore } from '../store/adminUsersStore';

export default function AdminUsersShowPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { selectedUser, loading, error, fetchUser, deleteUser } = useAdminUsersStore();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetchUser(userId);
  }, [fetchUser, userId]);

  const handleDelete = async () => {
    await deleteUser(userId);
    setDeleteOpen(false);
    navigate('/admin/users');
  };

  if (loading && !selectedUser) {
    return <LoadingBlock message="Loading user..." />;
  }

  if (!selectedUser) {
    return <FeedbackAlert message={error || 'User not found.'} />;
  }

  return (
    <div>
      <PageHeader
        title="users.show"
        description="Inspect the current resource payload returned by the Laravel API."
        actions={
          <>
            <Link to={`/admin/users/${userId}/edit`} className="btn btn-primary">
              Edit user
            </Link>
            <BackLink to="/admin/users" />
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
                  <td>{selectedUser.name}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Email</th>
                  <td>{selectedUser.email}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Role</th>
                  <td>{selectedUser.role}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Department</th>
                  <td>
                    {selectedUser.department ? (
                      <Link to={`/admin/departments/${selectedUser.department.id}`}>
                        {selectedUser.department.name} ({selectedUser.department.type})
                      </Link>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="text-secondary">Status</th>
                  <td>
                    <StatusPill active={selectedUser.is_active} />
                  </td>
                </tr>
                <tr>
                  <th className="text-secondary">Created</th>
                  <td>{selectedUser.created_at || '-'}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Updated</th>
                  <td>{selectedUser.updated_at || '-'}</td>
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
                This page keeps the UI naming close to `users.show`, `users.update`, and
                `users.destroy`.
              </p>
              <button type="button" className="btn btn-outline-danger" onClick={() => setDeleteOpen(true)}>
                Delete user
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete user"
        message="Delete this user account? This action cannot be undone."
        confirmLabel="Delete user"
        confirming={loading}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}

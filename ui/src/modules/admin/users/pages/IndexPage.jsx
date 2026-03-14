import React, { useEffect, useState } from 'react';
import ConfirmModal from '../../../../shared/components/ConfirmModal';
import { Link } from 'react-router-dom';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import Pagination from '../../../../shared/components/Pagination';
import UserTable from '../components/UserTable';
import { useAdminUsersStore } from '../store/adminUsersStore';

export default function AdminUsersIndexPage() {
  const { users, pagination, loading, error, fetchUsers, deleteUser } = useAdminUsersStore();
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteRequest = (userId) => {
    setDeleteTarget(userId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    await deleteUser(deleteTarget);
    setDeleteTarget(null);
  };

  const handlePageChange = (page) => {
    fetchUsers({ page });
  };

  const handlePerPageChange = (perPage) => {
    fetchUsers({ page: 1, per_page: perPage });
  };

  return (
    <div>
      <PageHeader
        title="users.index"
        description="Admin resource list aligned to the Laravel `users.index` endpoint."
        actions={
          <Link to="/admin/users/create" className="btn btn-primary">
            Create user
          </Link>
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      {loading ? (
        <LoadingBlock message="Loading users..." />
      ) : (
        <>
          <UserTable users={users} onDelete={handleDeleteRequest} />
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete user"
        message="Delete this user account? This action cannot be undone."
        confirmLabel="Delete user"
        confirming={loading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import StatusPill from '../../../../shared/components/StatusPill';

export default function UserTable({ users, onDelete }) {
  if (!users.length) {
    return (
      <div className="text-center py-5 text-secondary">
        No users returned yet. Configure an API token and create records from the Laravel API.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.department?.name || '-'}</td>
              <td>
                <StatusPill active={user.is_active} />
              </td>
              <td className="text-end">
                <div className="btn-group">
                  <Link to={`/admin/users/${user.id}`} className="btn btn-sm btn-outline-secondary">
                    View
                  </Link>
                  <Link to={`/admin/users/${user.id}/edit`} className="btn btn-sm btn-outline-primary">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function DepartmentTable({ departments, onDelete }) {
  if (!departments.length) {
    return (
      <div className="text-center py-5 text-secondary">
        No departments available yet. Create one to assign users by department.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Users</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.id}>
              <td>{department.name}</td>
              <td>{department.type}</td>
              <td>{department.users_count}</td>
              <td className="text-end">
                <div className="btn-group">
                  <Link to={`/admin/departments/${department.id}`} className="btn btn-sm btn-outline-secondary">
                    View
                  </Link>
                  <Link to={`/admin/departments/${department.id}/edit`} className="btn btn-sm btn-outline-primary">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(department.id)}
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

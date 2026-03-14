import React from 'react';
import PageHeader from '../components/PageHeader';
import { useAuthStore } from '../../stores/authStore';

export default function RoleDashboardPage({ title }) {
  const { user, role } = useAuthStore();

  return (
    <div>
      <PageHeader
        title={title}
        description="Authenticated dashboard profile powered by Laravel Sanctum session state."
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table mb-0">
              <tbody>
                <tr>
                  <th className="text-secondary">Name</th>
                  <td>{user?.name || '-'}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Email</th>
                  <td>{user?.email || '-'}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Role</th>
                  <td>{role || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

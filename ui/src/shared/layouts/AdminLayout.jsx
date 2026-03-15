import React from 'react';
import RoleLayout from './RoleLayout';

export default function AdminLayout() {
  return (
    <RoleLayout
      title="Admin Console"
      basePath="/admin"
      showSidebar
      extraLinks={[
        { label: 'Users', to: '/admin/users' },
        { label: 'Departments', to: '/admin/departments' },
        { label: 'Items', to: '/admin/items' },
        { label: 'Categories', to: '/admin/categories' },
        { label: 'Contracts', to: '/admin/contracts' },
        { label: 'Vendors', to: '/admin/vendors' },
        { label: 'Distributions', to: '/admin/distributions' },
      ]}
    />
  );
}

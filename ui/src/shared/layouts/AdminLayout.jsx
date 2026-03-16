import React from 'react';
import RoleLayout from './RoleLayout';

export default function AdminLayout() {
  return (
    <RoleLayout
      title="Admin Console"
      basePath="/admin"
      showSidebar
      extraLinks={[
        { label: 'Users', to: '/admin/users', icon: 'bi-people' },
        { label: 'Departments', to: '/admin/departments', icon: 'bi-diagram-3' },
        { label: 'Warehouse', to: '/admin/items', icon: 'bi-boxes' },
        { label: 'Categories', to: '/admin/categories', icon: 'bi-tags' },
        { label: 'Contracts', to: '/admin/contracts', icon: 'bi-file-earmark-text' },
        { label: 'Vendors', to: '/admin/vendors', icon: 'bi-shop' },
        { label: 'Distributions', to: '/admin/distributions', icon: 'bi-truck' },
      ]}
    />
  );
}

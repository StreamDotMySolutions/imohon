import React from 'react';
import RoleLayout from './RoleLayout';

export default function SystemLayout() {
  return (
    <RoleLayout
      title="System Console"
      basePath="/system"
      showSidebar
      extraLinks={[
        { label: 'Users', to: '/system/users', icon: 'bi-people' },
        { label: 'Departments', to: '/system/departments', icon: 'bi-diagram-3' },
        { label: 'Warehouse', to: '/system/items', icon: 'bi-boxes' },
        { label: 'Categories', to: '/system/categories', icon: 'bi-tags' },
        { label: 'Contracts', to: '/system/contracts', icon: 'bi-file-earmark-text' },
        { label: 'Vendors', to: '/system/vendors', icon: 'bi-shop' },
        { label: 'Distributions', to: '/system/distributions', icon: 'bi-truck' },
      ]}
    />
  );
}

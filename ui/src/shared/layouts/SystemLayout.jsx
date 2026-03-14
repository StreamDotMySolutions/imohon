import React from 'react';
import RoleLayout from './RoleLayout';

export default function SystemLayout() {
  return (
    <RoleLayout
      title="System Console"
      basePath="/system"
      extraLinks={[
        { label: 'Users', to: '/system/users' },
        { label: 'Departments', to: '/system/departments' },
        { label: 'Items', to: '/system/items' },
        { label: 'Categories', to: '/system/categories' },
        { label: 'Vendors', to: '/system/vendors' },
        { label: 'Distributions', to: '/system/distributions' },
      ]}
    />
  );
}

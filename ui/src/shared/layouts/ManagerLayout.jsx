import React from 'react';
import RoleLayout from './RoleLayout';

export default function ManagerLayout() {
  return (
    <RoleLayout
      title="Manager Console"
      basePath="/manager"
      showSidebar={false}
      extraLinks={[{ label: 'Requests', to: '/manager/requests' }]}
    />
  );
}

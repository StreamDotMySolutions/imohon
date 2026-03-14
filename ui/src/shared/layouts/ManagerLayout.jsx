import React from 'react';
import RoleLayout from './RoleLayout';

export default function ManagerLayout() {
  return (
    <RoleLayout
      title="Manager Console"
      basePath="/manager"
      extraLinks={[{ label: 'Requests', to: '/manager/requests' }]}
    />
  );
}

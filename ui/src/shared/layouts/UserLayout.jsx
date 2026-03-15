import React from 'react';
import RoleLayout from './RoleLayout';

export default function UserLayout() {
  return (
    <RoleLayout
      title="User Console"
      basePath="/user"
      showSidebar={false}
      extraLinks={[{ label: 'Requests', to: '/user/requests' }]}
    />
  );
}

import React from 'react';
import RoleLayout from './RoleLayout';

export default function GeneralManagerLayout() {
  return (
    <RoleLayout
      title="General Manager Console"
      basePath="/general-manager"
      extraLinks={[
        { label: 'Requests', to: '/general-manager/requests' },
        { label: 'Distributions', to: '/general-manager/distributions' },
      ]}
    />
  );
}

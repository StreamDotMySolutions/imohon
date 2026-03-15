import React from 'react';
import RoleLayout from './RoleLayout';

export default function GeneralManagerLayout() {
  return (
    <RoleLayout
      title="General Manager Console"
      basePath="/general-manager"
      showSidebar={false}
      extraLinks={[
        { label: 'Distributions', to: '/general-manager/distributions' },
      ]}
    />
  );
}

import React from 'react';
import RoleLayout from './RoleLayout';

export default function GeneralManagerLayout() {
  return (
    <RoleLayout
      title="General Manager Console"
      basePath="/general-manager"
      extraLinks={[
        { label: 'Distributions', to: '/general-manager/distributions' },
      ]}
    />
  );
}

import React from 'react';
import RoleLayout from './RoleLayout';

export default function VendorLayout() {
  return (
    <RoleLayout
      title="Vendor Console"
      basePath="/vendor"
      showSidebar
      extraLinks={[
        { label: 'Items', to: '/vendor/items' },
        { label: 'Distributions', to: '/vendor/distributions' },
      ]}
    />
  );
}

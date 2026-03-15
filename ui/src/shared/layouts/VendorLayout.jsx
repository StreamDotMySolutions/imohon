import React from 'react';
import RoleLayout from './RoleLayout';

export default function VendorLayout() {
  return (
    <RoleLayout
      title="Vendor Console"
      basePath="/vendor"
      showSidebar={false}
      extraLinks={[{ label: 'Items', to: '/vendor/items' }]}
    />
  );
}

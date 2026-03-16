import React from 'react';

const STATUS_COLORS = {
  in_stock: 'success',
  distributed: 'primary',
  accepted: 'info',
  missing: 'warning',
  damaged: 'danger',
  wrong_item: 'secondary',
};

const STATUS_LABELS = {
  in_stock: 'In Stock',
  distributed: 'Distributed',
  accepted: 'Accepted',
  missing: 'Missing',
  damaged: 'Damaged',
  wrong_item: 'Wrong Item',
};

export default function ItemStatusPill({ status }) {
  const color = STATUS_COLORS[status] || 'secondary';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`badge bg-${color} text-white`}>
      {label}
    </span>
  );
}

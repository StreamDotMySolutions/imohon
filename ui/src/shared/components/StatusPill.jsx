import React from 'react';

export default function StatusPill({ active }) {
  return (
    <span className={`status-pill ${active ? 'active' : 'inactive'}`}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

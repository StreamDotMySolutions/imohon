import React from 'react';

export default function LoadingBlock({ message = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-3 py-5">
      <div className="spinner-border text-primary" role="status" />
      <span className="text-secondary">{message}</span>
    </div>
  );
}

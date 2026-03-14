import React from 'react';

export default function FeedbackAlert({ message, variant = 'danger' }) {
  if (!message) {
    return null;
  }

  return <div className={`alert alert-${variant}`}>{message}</div>;
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function BackLink({ to, children = 'Back', className = 'btn btn-outline-secondary' }) {
  return (
    <Link to={to} className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-sm me-1"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 6l-6 6l6 6" />
        <path d="M4 12h16" />
      </svg>
      {children}
    </Link>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Admin-first shell prepared around the Laravel resource routes."
      />

      <div className="card border-0 bg-body-tertiary">
        <div className="card-body">
          <h2 className="h5">users.index</h2>
          <p className="text-secondary mb-3">
            The first implemented UI module mirrors the `/api/admin/users` resource and
            keeps the naming close to the Laravel controller actions.
          </p>
          <Link to="/admin/users" className="btn btn-primary">
            Open Users
          </Link>
        </div>
      </div>
    </div>
  );
}

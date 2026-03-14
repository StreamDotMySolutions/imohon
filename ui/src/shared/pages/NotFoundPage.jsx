import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container py-5">
      <div className="content-card card mx-auto" style={{ maxWidth: 640 }}>
        <div className="card-body p-5 text-center">
          <h1 className="display-6 mb-3">Page not found</h1>
          <p className="text-secondary mb-4">
            The route does not exist in the current role-based frontend structure.
          </p>
          <Link to="/admin/users" className="btn btn-primary">
            Go to Users
          </Link>
        </div>
      </div>
    </div>
  );
}

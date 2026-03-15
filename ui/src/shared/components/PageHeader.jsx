import React from 'react';

export default function PageHeader({ title, description, actions, actionsClassName = '' }) {
  return (
    <div className="page-header mb-4">
      <div>
        <h1 className="h3 mb-1">{title}</h1>
        {description ? <p className="text-secondary mb-0">{description}</p> : null}
      </div>
      {actions ? <div className={`d-flex gap-2 ${actionsClassName}`.trim()}>{actions}</div> : null}
    </div>
  );
}

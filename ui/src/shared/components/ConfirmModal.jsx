import React from 'react';

export default function ConfirmModal({
  open,
  title = 'Confirm action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  confirming = false,
  onConfirm,
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <>
      <div className="modal modal-blur fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} disabled={confirming} />
            </div>
            <div className="modal-body">
              <p className="mb-0 text-secondary">{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-link link-secondary me-auto" onClick={onClose} disabled={confirming}>
                {cancelLabel}
              </button>
              <button
                type="button"
                className={`btn btn-${confirmVariant}`}
                onClick={onConfirm}
                disabled={confirming}
              >
                {confirming ? 'Processing...' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

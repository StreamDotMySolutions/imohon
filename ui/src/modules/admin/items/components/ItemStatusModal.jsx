import React, { useState, useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'distributed', label: 'Distributed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'missing', label: 'Missing' },
  { value: 'damaged', label: 'Damaged' },
  { value: 'wrong_item', label: 'Wrong Item' },
];

export default function ItemStatusModal({ item, isOpen, onClose, onSave, isSaving }) {
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setStatus(item.status);
      setNotes(item.notes || '');
    }
  }, [item, isOpen]);

  const handleSave = async () => {
    try {
      await onSave(item.id, { status, notes });
      onClose();
    } catch (error) {
      // Error is handled by the store
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Item Status</h5>
            <button
              type="button"
              className="btn-close"
              disabled={isSaving}
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Reference ID</label>
              <input
                type="text"
                className="form-control font-monospace"
                disabled
                value={item.reference_id || '-'}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Item ID</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={item.id}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={item.category_name || '-'}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Vendor</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={item.vendor_name || '-'}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="statusSelect" className="form-label">
                Status
              </label>
              <select
                id="statusSelect"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSaving}
              >
                <option value="">Select Status</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="notesTextarea" className="form-label">
                Notes
              </label>
              <textarea
                id="notesTextarea"
                className="form-control"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSaving}
                placeholder="Optional notes about this item"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isSaving}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

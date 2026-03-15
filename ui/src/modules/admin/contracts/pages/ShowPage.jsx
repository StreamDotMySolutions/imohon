import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import ConfirmModal from '../../../../shared/components/ConfirmModal';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import StatusPill from '../../../../shared/components/StatusPill';
import { useAdminContractsStore } from '../store/adminContractsStore';

export default function AdminContractsShowPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { selectedContract, loading, error, fetchContract, deleteContract } = useAdminContractsStore();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetchContract(contractId);
  }, [fetchContract, contractId]);

  const handleDelete = async () => {
    await deleteContract(contractId);
    setDeleteOpen(false);
    navigate('/admin/contracts');
  };

  if (loading && !selectedContract) {
    return <LoadingBlock message="Loading contract..." />;
  }

  if (!selectedContract) {
    return <FeedbackAlert message={error || 'Contract not found.'} />;
  }

  return (
    <div>
      <PageHeader
        title="contracts.show"
        description="View contract information and audit trail."
        actions={
          <>
            <Link to={`/admin/contracts/${contractId}/edit`} className="btn btn-primary">
              Edit contract
            </Link>
            <BackLink to="/admin/contracts" />
          </>
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table mb-0">
              <tbody>
                <tr>
                  <th className="text-secondary">Contract number</th>
                  <td>{selectedContract.contract_number}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Vendor</th>
                  <td>{selectedContract.vendor_name}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Category</th>
                  <td>{selectedContract.category_name}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Total</th>
                  <td>{selectedContract.total}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Start</th>
                  <td>{selectedContract.date_start || '-'}</td>
                </tr>
                <tr>
                  <th className="text-secondary">End</th>
                  <td>{selectedContract.date_end || '-'}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Delivery</th>
                  <td>{selectedContract.date_delivery || '-'}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Status</th>
                  <td>
                    <StatusPill active={selectedContract.active} />
                  </td>
                </tr>
                <tr>
                  <th className="text-secondary">Created</th>
                  <td>{selectedContract.created_at}</td>
                </tr>
                <tr>
                  <th className="text-secondary">Updated</th>
                  <td>{selectedContract.updated_at}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 bg-body-tertiary">
            <div className="card-body">
              <h2 className="h5">Resource actions</h2>
              <p className="text-secondary mb-3">
                This view mirrors the contract payload returned by the API.
              </p>
              <button type="button" className="btn btn-outline-danger" onClick={() => setDeleteOpen(true)}>
                Delete contract
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete contract"
        message="Delete this contract? This action cannot be undone."
        confirmLabel="Delete contract"
        confirmVariant="danger"
        confirming={loading}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../../../shared/components/ConfirmModal';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import Pagination from '../../../../shared/components/Pagination';
import ContractTable from '../components/ContractTable';
import { useAdminContractsStore } from '../store/adminContractsStore';

export default function AdminContractsIndexPage() {
  const {
    contracts,
    pagination,
    loading,
    error,
    filters,
    fetchContracts,
    deleteContract,
    toggleActive,
  } = useAdminContractsStore();
  const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    const normalized = searchTerm.trim();
    const timeoutId = window.setTimeout(() => {
      fetchContracts({ page: 1, search: normalized }, { silent: true });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [fetchContracts, searchTerm]);

  const handlePageChange = (page) => {
    fetchContracts({ page });
  };

  const handlePerPageChange = (perPage) => {
    fetchContracts({ page: 1, per_page: perPage });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    await deleteContract(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleToggleStatus = async (contract) => {
    await toggleActive(contract.id, !contract.active);
  };

  return (
    <div>
      <PageHeader
        title="contracts.index"
        description="Track ongoing contracts and their delivery timelines."
        actionsClassName="category-page-header-actions"
        actions={
          <div className="category-header-actions">
            <Link to="/admin/contracts/create" className="btn btn-primary">
              Create
            </Link>
            <input
              type="search"
              className="form-control category-header-search"
              placeholder="Search contracts"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      {loading ? (
        <LoadingBlock message="Loading contracts..." />
      ) : (
        <>
          <ContractTable
            contracts={contracts}
            onDelete={setDeleteTarget}
            onToggleStatus={handleToggleStatus}
          />
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete contract"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.contract_number}?`
            : 'Delete this contract?'
        }
        confirmLabel="Delete contract"
        confirming={loading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

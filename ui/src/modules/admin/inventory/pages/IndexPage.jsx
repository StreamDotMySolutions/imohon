import React, { useEffect, useState } from 'react';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import Pagination from '../../../../shared/components/Pagination';
import InventoryTable from '../components/InventoryTable';
import { useAdminInventoryStore } from '../store/adminInventoryStore';

export default function AdminInventoryIndexPage() {
  const {
    inventories,
    pagination,
    loading,
    summaryLoading,
    summary,
    error,
    filters,
    fetchInventories,
    fetchSummary,
  } = useAdminInventoryStore();
  const [searchTerm, setSearchTerm] = useState(filters.search ?? '');

  useEffect(() => {
    fetchInventories();
    fetchSummary();
  }, [fetchInventories, fetchSummary]);

  useEffect(() => {
    const normalized = searchTerm.trim();
    const timeoutId = window.setTimeout(() => {
      fetchInventories({ page: 1, search: normalized }, { silent: true });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [fetchInventories, searchTerm]);

  const handlePageChange = (page) => {
    fetchInventories({ page });
  };

  const handlePerPageChange = (perPage) => {
    fetchInventories({ page: 1, per_page: perPage });
  };

  return (
    <div>
      <PageHeader
        title="Warehouse Inventory"
        description="View all items currently in warehouse stock from vendor contracts."
        actionsClassName="category-page-header-actions"
        actions={
          <div className="category-header-actions">
            <input
              type="search"
              className="form-control category-header-search"
              placeholder="Search by category, vendor, contract, or reference..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">Total Units</h6>
              {summaryLoading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <h3 className="mb-0">{summary.total_units || 0}</h3>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">Top Categories</h6>
              {summaryLoading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : summary.by_category && summary.by_category.length > 0 ? (
                <div className="small">
                  {summary.by_category.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <span>{item.name}</span>
                      <strong>{item.total}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted small">No data</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">Top Vendors</h6>
              {summaryLoading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : summary.by_vendor && summary.by_vendor.length > 0 ? (
                <div className="small">
                  {summary.by_vendor.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <span>{item.name}</span>
                      <strong>{item.total}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted small">No data</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <LoadingBlock message="Loading inventory..." />
      ) : (
        <>
          <InventoryTable inventories={inventories} />
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}
    </div>
  );
}

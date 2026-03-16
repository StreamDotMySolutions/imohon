import React, { useEffect, useState } from 'react';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import Pagination from '../../../../shared/components/Pagination';
import InventoryTable from '../components/InventoryTable';
import { useAdminInventoryStore } from '../store/adminInventoryStore';
import ItemsTable from '../../items/components/ItemsTable';
import ItemStatusModal from '../../items/components/ItemStatusModal';
import { useAdminItemsStore } from '../../items/store/adminItemsStore';
import { http } from '../../../../shared/lib/http';

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
  const {
    items,
    pagination: itemsPagination,
    loading: itemsLoading,
    saving: itemsSaving,
    error: itemsError,
    filters: itemsFilters,
    fetchItems,
    updateItemStatus,
  } = useAdminItemsStore();
  const [activeTab, setActiveTab] = useState('summary');
  const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
  const [itemsSearchTerm, setItemsSearchTerm] = useState(itemsFilters.search ?? '');
  const [editingItem, setEditingItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);

  // Fetch categories and vendors for filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [catsRes, vendorsRes] = await Promise.all([
          http.get('/admin/categories', { params: { per_page: 999, all: 1, type: 'item' } }),
          http.get('/admin/vendors', { params: { per_page: 999 } }),
        ]);
        setCategories(catsRes.data.data || []);
        setVendors(vendorsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (activeTab === 'summary') {
      fetchInventories();
      fetchSummary();
    } else if (activeTab === 'items') {
      fetchItems();
    }
  }, [activeTab, fetchInventories, fetchSummary, fetchItems]);

  useEffect(() => {
    const normalized = searchTerm.trim();
    const timeoutId = window.setTimeout(() => {
      if (activeTab === 'summary') {
        fetchInventories({ page: 1, search: normalized }, { silent: true });
      }
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [fetchInventories, searchTerm, activeTab]);

  useEffect(() => {
    const normalized = itemsSearchTerm.trim();
    const timeoutId = window.setTimeout(() => {
      if (activeTab === 'items') {
        fetchItems({ page: 1, search: normalized }, { silent: true });
      }
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [fetchItems, itemsSearchTerm, activeTab]);

  const handlePageChange = (page) => {
    if (activeTab === 'summary') {
      fetchInventories({ page });
    } else if (activeTab === 'items') {
      fetchItems({ page });
    }
  };

  const handlePerPageChange = (perPage) => {
    if (activeTab === 'summary') {
      fetchInventories({ page: 1, per_page: perPage });
    } else if (activeTab === 'items') {
      fetchItems({ page: 1, per_page: perPage });
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
  };

  const handleSaveItemStatus = (id, data) => {
    return updateItemStatus(id, data);
  };

  return (
    <div>
      <PageHeader
        title="Warehouse"
        description="View inventory summary or browse individual item units."
        actionsClassName="category-page-header-actions"
        actions={
          <div className="category-header-actions">
            <input
              type="search"
              className="form-control category-header-search"
              placeholder={
                activeTab === 'summary'
                  ? 'Search by category, vendor, contract, or reference...'
                  : 'Search by category, vendor, or contract...'
              }
              value={activeTab === 'summary' ? searchTerm : itemsSearchTerm}
              onChange={(event) =>
                activeTab === 'summary'
                  ? setSearchTerm(event.target.value)
                  : setItemsSearchTerm(event.target.value)
              }
            />
          </div>
        }
      />

      {error || itemsError ? (
        <FeedbackAlert message={error || itemsError} />
      ) : null}

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            Items
          </button>
        </li>
      </ul>

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <>
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
        </>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <>
          {/* Filter Controls */}
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label small text-muted">Status</label>
              <select
                className="form-select form-select-sm"
                value={itemsFilters.status ?? ''}
                onChange={(e) => fetchItems({ page: 1, status: e.target.value }, { silent: true })}
              >
                <option value="">All Statuses</option>
                <option value="in_stock">In Stock</option>
                <option value="distributed">Distributed</option>
                <option value="accepted">Accepted</option>
                <option value="missing">Missing</option>
                <option value="damaged">Damaged</option>
                <option value="wrong_item">Wrong Item</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Category</label>
              <select
                className="form-select form-select-sm"
                value={itemsFilters.category_id ?? ''}
                onChange={(e) => fetchItems({ page: 1, category_id: e.target.value }, { silent: true })}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Vendor</label>
              <select
                className="form-select form-select-sm"
                value={itemsFilters.vendor_id ?? ''}
                onChange={(e) => fetchItems({ page: 1, vendor_id: e.target.value }, { silent: true })}
              >
                <option value="">All Vendors</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">&nbsp;</label>
              <button
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={() => {
                  setItemsSearchTerm('');
                  fetchItems({ page: 1, search: '', status: '', category_id: '', vendor_id: '' });
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {itemsLoading ? (
            <LoadingBlock message="Loading items..." />
          ) : (
            <>
              <ItemsTable items={items} onEditClick={handleEditItem} />
              <Pagination
                pagination={itemsPagination}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
              />
            </>
          )}
        </>
      )}

      {/* Item Status Modal */}
      <ItemStatusModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={handleCloseModal}
        onSave={handleSaveItemStatus}
        isSaving={itemsSaving}
      />
    </div>
  );
}

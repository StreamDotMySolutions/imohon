import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import ContractForm from '../components/ContractForm';
import { useAdminContractsStore } from '../store/adminContractsStore';
import { adminCategoriesApi } from '../../categories/api/adminCategoriesApi';

const emptyForm = {
  contract_number: '',
  vendor_id: '',
  items: [],
  date_start: '',
  date_end: '',
  date_delivery: '',
  active: true,
};

export default function AdminContractsEditPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const {
    selectedContract,
    fetchContract,
    updateContract,
    saving,
    loading,
    error,
    validationErrors,
    clearMessages,
    fetchVendors,
    vendors,
  } = useAdminContractsStore();
  const [form, setForm] = useState(emptyForm);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    fetchContract(contractId);
    fetchVendors();

    adminCategoriesApi
      .index({ all: 1, per_page: 300 })
      .then((response) => {
        setCategoryOptions(response.data.data);
      })
      .catch(() => {
        setCategoryOptions([]);
      });
  }, [contractId, fetchContract, fetchVendors]);

  useEffect(() => {
    if (!selectedContract) {
      return;
    }

    setForm({
      contract_number: selectedContract.contract_number || '',
      vendor_id: selectedContract.vendor_id || '',
      items: (selectedContract.items || []).map((item) => ({
        id: item.id,
        category_id: item.category_id,
        category_name: item.category_name,
        quantity: item.quantity,
      })),
      date_start: selectedContract.date_start_raw || '',
      date_end: selectedContract.date_end_raw || '',
      date_delivery: selectedContract.date_delivery_raw || '',
      active: Boolean(selectedContract.active),
    });
  }, [selectedContract]);

  const normalizedErrors = useMemo(() => validationErrors || {}, [validationErrors]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    clearMessages();

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : type === 'array' ? value : value,
    }));
  };

  const handleItemsChange = (items) => {
    clearMessages();
    setForm((current) => ({ ...current, items }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateContract(contractId, {
        ...form,
        vendor_id: form.vendor_id || null,
      });
      navigate(`/admin/contracts/${contractId}`);
    } catch {
      // errors handled in store
    }
  };

  if (loading && !selectedContract) {
    return <LoadingBlock message="Loading contract..." />;
  }

  return (
    <div>
      <PageHeader
        title="contracts.update"
        description="Adjust the contract details and associated schedule."
        actions={<BackLink to={`/admin/contracts/${contractId}`} />}
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <ContractForm
        form={form}
        onChange={handleChange}
        onItemsChange={handleItemsChange}
        onSubmit={handleSubmit}
        saving={saving}
        validationErrors={normalizedErrors}
        vendorOptions={vendors}
        categoryOptions={categoryOptions}
      />
    </div>
  );
}

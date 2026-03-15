import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import PageHeader from '../../../../shared/components/PageHeader';
import ContractForm from '../components/ContractForm';
import { useAdminContractsStore } from '../store/adminContractsStore';
import { adminCategoriesApi } from '../../categories/api/adminCategoriesApi';

const initialForm = {
  contract_number: '',
  vendor_id: '',
  items: [],
  date_start: '',
  date_end: '',
  date_delivery: '',
  active: true,
};

export default function AdminContractsCreatePage() {
  const navigate = useNavigate();
  const {
    createContract,
    saving,
    error,
    validationErrors,
    clearMessages,
    fetchVendors,
    vendors,
  } = useAdminContractsStore();
  const [form, setForm] = useState(initialForm);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    fetchVendors();

    adminCategoriesApi
      .index({ all: 1, per_page: 300 })
      .then((response) => {
        setCategoryOptions(response.data.data);
      })
      .catch(() => {
        setCategoryOptions([]);
      });
  }, [fetchVendors]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    clearMessages();

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : type === 'array' ? value : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...form,
        vendor_id: form.vendor_id || null,
      };
      const contract = await createContract(payload);
      navigate(`/admin/contracts/${contract.id}`);
    } catch {
      // errors handled in store
    }
  };

  return (
    <div>
      <PageHeader
        title="contracts.store"
        description="Register a new contract with either a vendor record or manual details."
        actions={<BackLink to="/admin/contracts" />}
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <ContractForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        saving={saving}
        validationErrors={validationErrors}
        vendorOptions={vendors}
        categoryOptions={categoryOptions}
      />
    </div>
  );
}

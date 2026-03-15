import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import PageHeader from '../../../../shared/components/PageHeader';
import CategoryForm from '../components/CategoryForm';
import { useAdminCategoriesStore } from '../store/adminCategoriesStore';

const initialForm = {
  name: '',
  slug: '',
  description: '',
  is_active: true,
  parent_id: '',
};

export default function AdminCategoriesCreatePage() {
  const navigate = useNavigate();
  const {
    createCategory,
    saving,
    error,
    validationErrors,
    clearMessages,
    fetchAllCategories,
    allCategories,
  } = useAdminCategoriesStore();
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const normalizedErrors = useMemo(() => validationErrors || {}, [validationErrors]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    clearMessages();
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const category = await createCategory({
        ...form,
        parent_id: form.parent_id || null,
      });
      navigate(`/admin/categories/${category.id}`);
    } catch {
      // handled in store
    }
  };

  const parentOptions = allCategories.map((category) => ({
    id: category.id,
    name: category.name,
    depth: category.depth || 0,
  }));

  return (
    <div>
      <PageHeader
        title="categories.store"
        description="Create a nested category supported by the backend."
        actions={<BackLink to="/admin/categories" />}
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <CategoryForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel="Create category"
        validationErrors={normalizedErrors}
        parentOptions={parentOptions}
      />
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import CategoryForm from '../components/CategoryForm';
import { useAdminCategoriesStore } from '../store/adminCategoriesStore';

const emptyForm = {
  type: '',
  name: '',
  slug: '',
  description: '',
  is_active: true,
  parent_id: '',
};

export default function AdminCategoriesEditPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const {
    selectedCategory,
    fetchCategory,
    updateCategory,
    saving,
    loading,
    error,
    validationErrors,
    clearMessages,
    fetchAllCategories,
    allCategories,
  } = useAdminCategoriesStore();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchCategory(categoryId);
    fetchAllCategories();
  }, [fetchCategory, fetchAllCategories, categoryId]);

  const parentOptions = useMemo(
    () =>
      allCategories
        .filter((category) => category.type === 'folder')
        .map((category) => ({
          id: category.id,
          name: category.name,
          depth: category.depth || 0,
        })),
    [allCategories],
  );

  useEffect(() => {
    if (!selectedCategory) {
      return;
    }

    setForm({
      type: selectedCategory.type || '',
      name: selectedCategory.name || '',
      slug: selectedCategory.slug || '',
      description: selectedCategory.description || '',
      is_active: Boolean(selectedCategory.is_active),
      parent_id: selectedCategory.parent_id || '',
    });
  }, [selectedCategory]);

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
      await updateCategory(categoryId, {
        ...form,
        parent_id: form.parent_id || null,
      });
      navigate(`/admin/categories/${categoryId}`);
    } catch {
      // handled in store
    }
  };

  if (loading && !selectedCategory) {
    return <LoadingBlock message="Loading category..." />;
  }

  return (
    <div>
      <PageHeader
        title="categories.update"
        description="Edit this category and adjust its hierarchy."
        actions={<BackLink to={`/admin/categories/${categoryId}`} />}
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <CategoryForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel="Update category"
        validationErrors={normalizedErrors}
        parentOptions={parentOptions}
        showParentSelect={form.type === 'item'}
        showTypeSelector
      />
    </div>
  );
}

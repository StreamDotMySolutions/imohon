import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import PageHeader from '../../../../shared/components/PageHeader';
import CategoryForm from '../components/CategoryForm';
import { useAdminCategoriesStore } from '../store/adminCategoriesStore';

const initialForm = {
  type: '',
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
  const [categoryType, setCategoryType] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const normalizedErrors = useMemo(() => validationErrors || {}, [validationErrors]);

  const handleTypeSelect = (type) => {
    setCategoryType(type);
    setForm((current) => ({
      ...current,
      type,
      parent_id: type === 'folder' ? '' : current.parent_id,
    }));
    setStep(2);
  };

  const handleBackToType = () => {
    setStep(1);
  };

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

  const typeSelections = [
    { label: 'Folder', value: 'folder', description: 'Create a parent category.' },
    { label: 'Item', value: 'item', description: 'Create a leaf entry that requires a parent.' },
  ];

  return (
    <div>
      <PageHeader
        title="categories.store"
        description="Create a nested category supported by the backend."
        actions={<BackLink to="/admin/categories" />}
      />

      {error ? <FeedbackAlert message={error} /> : null}

      {step === 1 && (
        <div className="row g-3">
          {typeSelections.map((selection) => (
            <div className="col-sm-6" key={selection.value}>
              <div className="card card-body d-flex flex-column gap-3">
                <div>
                  <h5 className="mb-1">{selection.label}</h5>
                  <p className="text-muted mb-0">{selection.description}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleTypeSelect(selection.value)}
                >
                  Choose {selection.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 2 && (
        <>
          <div className="mb-3 d-flex align-items-center gap-2">
            <span className="badge bg-secondary text-uppercase">
              {categoryType || 'Select type'}
            </span>
            <button type="button" className="btn btn-link p-0" onClick={handleBackToType}>
              Change type
            </button>
          </div>
          <CategoryForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel="Create category"
            validationErrors={normalizedErrors}
            parentOptions={parentOptions}
            showParentSelect={categoryType === 'item'}
          />
        </>
      )}
    </div>
  );
}

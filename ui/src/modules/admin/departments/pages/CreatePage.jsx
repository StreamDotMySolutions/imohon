import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import PageHeader from '../../../../shared/components/PageHeader';
import DepartmentForm from '../components/DepartmentForm';
import { useAdminDepartmentsStore } from '../store/adminDepartmentsStore';

const initialForm = {
  name: '',
  type: '',
};

export default function AdminDepartmentsCreatePage() {
  const navigate = useNavigate();
  const { createDepartment, saving, error, validationErrors, clearMessages } = useAdminDepartmentsStore();
  const [form, setForm] = useState(initialForm);

  const normalizedErrors = useMemo(() => validationErrors || {}, [validationErrors]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    clearMessages();
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const department = await createDepartment(form);
      navigate(`/admin/departments/${department.id}`);
    } catch (submitError) {
      // handled in store
    }
  };

  return (
    <div>
      <PageHeader
        title="departments.store"
        description="Create a department that can be assigned to admin-managed users."
        actions={<BackLink to="/admin/departments" />}
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <DepartmentForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel="Create department"
        validationErrors={normalizedErrors}
      />
    </div>
  );
}

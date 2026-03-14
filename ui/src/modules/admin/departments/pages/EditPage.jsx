import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import DepartmentForm from '../components/DepartmentForm';
import { useAdminDepartmentsStore } from '../store/adminDepartmentsStore';

const emptyForm = {
  name: '',
  type: '',
};

export default function AdminDepartmentsEditPage() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const {
    selectedDepartment,
    loading,
    saving,
    error,
    validationErrors,
    fetchDepartment,
    updateDepartment,
    clearMessages,
  } = useAdminDepartmentsStore();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchDepartment(departmentId);
  }, [fetchDepartment, departmentId]);

  useEffect(() => {
    if (!selectedDepartment) {
      return;
    }

    setForm({
      name: selectedDepartment.name || '',
      type: selectedDepartment.type || '',
    });
  }, [selectedDepartment]);

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
      const department = await updateDepartment(departmentId, form);
      navigate(`/admin/departments/${department.id}`);
    } catch (submitError) {
      // handled in store
    }
  };

  if (loading && !selectedDepartment) {
    return <LoadingBlock message="Loading department..." />;
  }

  return (
    <div>
      <PageHeader
        title="departments.update"
        description="Update a department used by role and user assignment rules."
        actions={<BackLink to={`/admin/departments/${departmentId}`} />}
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <DepartmentForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel="Update department"
        validationErrors={normalizedErrors}
      />
    </div>
  );
}

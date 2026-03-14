import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import PageHeader from '../../../../shared/components/PageHeader';
import UserForm from '../components/UserForm';
import { useAdminUsersStore } from '../store/adminUsersStore';
import { useAdminDepartmentsStore } from '../../departments/store/adminDepartmentsStore';

const initialForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
  department_id: '',
  is_active: true,
};

export default function AdminUsersCreatePage() {
  const navigate = useNavigate();
  const { createUser, saving, error, validationErrors, clearMessages } = useAdminUsersStore();
  const { allDepartments, fetchAllDepartments } = useAdminDepartmentsStore();
  const [form, setForm] = useState(initialForm);

  const normalizedErrors = useMemo(() => validationErrors || {}, [validationErrors]);
  const departmentOptions = useMemo(
    () =>
      allDepartments.map((department) => ({
        value: department.id,
        label: department.name,
        type: department.type,
      })),
    [allDepartments]
  );

  useEffect(() => {
    fetchAllDepartments();
  }, [fetchAllDepartments]);

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
      const user = await createUser({
        ...form,
        department_id: Number(form.department_id),
      });

      navigate(`/admin/users/${user.id}`);
    } catch (submitError) {
      // handled in store
    }
  };

  return (
    <div>
      <PageHeader
        title="users.store"
        description="Create a user using the same payload fields accepted by the Laravel API."
        actions={
          <BackLink to="/admin/users" />
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <UserForm
        form={form}
        departments={departmentOptions}
        onChange={handleChange}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel="Create user"
        validationErrors={normalizedErrors}
      />
    </div>
  );
}

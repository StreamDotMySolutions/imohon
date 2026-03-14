import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackLink from '../../../../shared/components/BackLink';
import FeedbackAlert from '../../../../shared/components/FeedbackAlert';
import LoadingBlock from '../../../../shared/components/LoadingBlock';
import PageHeader from '../../../../shared/components/PageHeader';
import UserForm from '../components/UserForm';
import { useAdminUsersStore } from '../store/adminUsersStore';
import { useAdminDepartmentsStore } from '../../departments/store/adminDepartmentsStore';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
  department_id: '',
  is_active: true,
};

export default function AdminUsersEditPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    selectedUser,
    loading,
    saving,
    error,
    validationErrors,
    fetchUser,
    updateUser,
    clearMessages,
  } = useAdminUsersStore();
  const { allDepartments, fetchAllDepartments } = useAdminDepartmentsStore();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchUser(userId);
  }, [fetchUser, userId]);

  useEffect(() => {
    fetchAllDepartments();
  }, [fetchAllDepartments]);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    setForm({
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      password: '',
      password_confirmation: '',
      role: selectedUser.role || '',
      department_id: selectedUser.department?.id || '',
      is_active: Boolean(selectedUser.is_active),
    });
  }, [selectedUser]);

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

    const payload = {
      ...form,
      department_id: Number(form.department_id),
    };

    if (!payload.password) {
      delete payload.password;
      delete payload.password_confirmation;
    }

    try {
      const user = await updateUser(userId, payload);
      navigate(`/admin/users/${user.id}`);
    } catch (submitError) {
      // handled in store
    }
  };

  if (loading && !selectedUser) {
    return <LoadingBlock message="Loading user..." />;
  }

  return (
    <div>
      <PageHeader
        title="users.update"
        description="Update a user while preserving the backend role and department validation rules."
        actions={
          <BackLink to={`/admin/users/${userId}`} />
        }
      />

      {error ? <FeedbackAlert message={error} /> : null}

      <UserForm
        form={form}
        departments={departmentOptions}
        onChange={handleChange}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel="Update user"
        validationErrors={normalizedErrors}
        mode="edit"
      />
    </div>
  );
}

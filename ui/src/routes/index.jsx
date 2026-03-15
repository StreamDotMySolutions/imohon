import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminUsersCreatePage from '../modules/admin/users/pages/CreatePage';
import AdminUsersEditPage from '../modules/admin/users/pages/EditPage';
import AdminUsersIndexPage from '../modules/admin/users/pages/IndexPage';
import AdminUsersShowPage from '../modules/admin/users/pages/ShowPage';
import AdminDepartmentsCreatePage from '../modules/admin/departments/pages/CreatePage';
import AdminDepartmentsEditPage from '../modules/admin/departments/pages/EditPage';
import AdminDepartmentsIndexPage from '../modules/admin/departments/pages/IndexPage';
import AdminDepartmentsShowPage from '../modules/admin/departments/pages/ShowPage';
import AdminCategoriesCreatePage from '../modules/admin/categories/pages/CreatePage';
import AdminCategoriesEditPage from '../modules/admin/categories/pages/EditPage';
import AdminCategoriesIndexPage from '../modules/admin/categories/pages/IndexPage';
import AdminCategoriesShowPage from '../modules/admin/categories/pages/ShowPage';
import AdminLayout from '../shared/layouts/AdminLayout';
import ManagerLayout from '../shared/layouts/ManagerLayout';
import UserLayout from '../shared/layouts/UserLayout';
import GeneralManagerLayout from '../shared/layouts/GeneralManagerLayout';
import VendorLayout from '../shared/layouts/VendorLayout';
import SystemLayout from '../shared/layouts/SystemLayout';
import ComingSoonPage from '../shared/pages/ComingSoonPage';
import LoginPage from '../shared/pages/LoginPage';
import NotFoundPage from '../shared/pages/NotFoundPage';
import RoleDashboardPage from '../shared/pages/RoleDashboardPage';
import RequireAuth from '../shared/router/RequireAuth';
import RequireRole from '../shared/router/RequireRole';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <RequireRole roles={['Admin']}>
          <AdminLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <RoleDashboardPage title="Admin Dashboard" />,
      },
      {
        path: 'users',
        children: [
          { index: true, element: <AdminUsersIndexPage /> },
          { path: 'create', element: <AdminUsersCreatePage /> },
          { path: ':userId', element: <AdminUsersShowPage /> },
          { path: ':userId/edit', element: <AdminUsersEditPage /> },
        ],
      },
      {
        path: 'departments',
        children: [
          { index: true, element: <AdminDepartmentsIndexPage /> },
          { path: 'create', element: <AdminDepartmentsCreatePage /> },
          { path: ':departmentId', element: <AdminDepartmentsShowPage /> },
          { path: ':departmentId/edit', element: <AdminDepartmentsEditPage /> },
        ],
      },
      {
        path: 'items',
        index: true,
        element: <ComingSoonPage title="Items" />,
      },
      {
        path: 'categories',
        children: [
          { index: true, element: <AdminCategoriesIndexPage /> },
          { path: 'create', element: <AdminCategoriesCreatePage /> },
          { path: ':categoryId', element: <AdminCategoriesShowPage /> },
          { path: ':categoryId/edit', element: <AdminCategoriesEditPage /> },
        ],
      },
      {
        path: 'vendors',
        index: true,
        element: <ComingSoonPage title="Vendors" />,
      },
    ],
  },
  {
    path: '/manager',
    element: (
      <RequireAuth>
        <RequireRole roles={['Manager']}>
          <ManagerLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <RoleDashboardPage title="Manager Dashboard" /> },
      {
        path: 'requests',
        index: true,
        element: <ComingSoonPage title="Requests" />,
      },
    ],
  },
  {
    path: '/user',
    element: (
      <RequireAuth>
        <RequireRole roles={['User']}>
          <UserLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <RoleDashboardPage title="User Dashboard" /> },
      {
        path: 'requests',
        index: true,
        element: <ComingSoonPage title="Requests" />,
      },
    ],
  },
  {
    path: '/general-manager',
    element: (
      <RequireAuth>
        <RequireRole roles={['GeneralManager']}>
          <GeneralManagerLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <RoleDashboardPage title="General Manager Dashboard" /> },
      {
        path: 'distributions',
        index: true,
        element: <ComingSoonPage title="Distributions" />,
      },
    ],
  },
  {
    path: '/system',
    element: (
      <RequireAuth>
        <RequireRole roles={['System']}>
          <SystemLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <RoleDashboardPage title="System Dashboard" />,
      },
      {
        path: 'users',
        children: [
          { index: true, element: <AdminUsersIndexPage /> },
          { path: 'create', element: <AdminUsersCreatePage /> },
          { path: ':userId', element: <AdminUsersShowPage /> },
          { path: ':userId/edit', element: <AdminUsersEditPage /> },
        ],
      },
      {
        path: 'departments',
        index: true,
        element: <ComingSoonPage title="Departments" />,
      },
      {
        path: 'items',
        index: true,
        element: <ComingSoonPage title="Items" />,
      },
      {
        path: 'categories',
        children: [
          { index: true, element: <AdminCategoriesIndexPage /> },
          { path: 'create', element: <AdminCategoriesCreatePage /> },
          { path: ':categoryId', element: <AdminCategoriesShowPage /> },
          { path: ':categoryId/edit', element: <AdminCategoriesEditPage /> },
        ],
      },
      {
        path: 'vendors',
        index: true,
        element: <ComingSoonPage title="Vendors" />,
      },
    ],
  },
      {
        path: '/vendor',
        element: (
          <RequireAuth>
            <RequireRole roles={['Vendor']}>
              <VendorLayout />
            </RequireRole>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <RoleDashboardPage title="Vendor Dashboard" /> },
          {
            path: 'items',
            index: true,
            element: <ComingSoonPage title="Items" />,
          },
          {
            path: 'distributions',
            index: true,
            element: <ComingSoonPage title="Distributions" />,
          },
        ],
      },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@tabler/core/dist/css/tabler.min.css';
import '@tabler/core/dist/js/tabler.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/app.css';
import { router } from './routes';
import { authStore } from './stores/authStore';

authStore.getState().initializeAuth();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

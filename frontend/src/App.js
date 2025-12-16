import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './components/AuthContext';
import { RoleGuard } from './components/RoleGuard';
import { ROLE_ADMIN, ROLE_PROCUREMENT_MANAGER, ROLE_CUSTOMER } from './constants/roles';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Orders from './pages/Orders';
import ManageUsers from './pages/ManageUsers';
import ManageProducts from './pages/ManageProducts';
import Logs from './pages/Logs';
import Reports from './pages/Reports';

/**
 * Redirects authenticated users to their default page based on role
 */
function LoginRoute() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // If already logged in, redirect to appropriate page
  if (currentUser) {
    if (currentUser.role === ROLE_ADMIN || currentUser.role === ROLE_PROCUREMENT_MANAGER) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/catalog" replace />;
  }

  return <Login />;
}

/**
 * Redirects root path to appropriate page based on auth status and role
 */
function HomeRedirect() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  if (currentUser.role === ROLE_ADMIN || currentUser.role === ROLE_PROCUREMENT_MANAGER) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/catalog" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public route - Login page */}
      <Route path="/login" element={<LoginRoute />} />
      
      {/* Root redirect */}
      <Route path="/" element={<HomeRedirect />} />
      
      {/* Protected routes - wrapped in Layout */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <RoleGuard allowedRoles={[ROLE_ADMIN, ROLE_PROCUREMENT_MANAGER]}>
              <Dashboard />
            </RoleGuard>
          </Layout>
        }
      />
      <Route
        path="/catalog"
        element={
          <Layout>
            <RoleGuard allowedRoles={[ROLE_ADMIN, ROLE_PROCUREMENT_MANAGER, ROLE_CUSTOMER]}>
              <Catalog />
            </RoleGuard>
          </Layout>
        }
      />
      <Route
        path="/orders"
        element={
          <Layout>
            <RoleGuard allowedRoles={[ROLE_ADMIN, ROLE_PROCUREMENT_MANAGER, ROLE_CUSTOMER]}>
              <Orders />
            </RoleGuard>
          </Layout>
        }
      />
      <Route
        path="/users"
        element={
          <Layout>
            <RoleGuard allowedRoles={[ROLE_ADMIN]}>
              <ManageUsers />
            </RoleGuard>
          </Layout>
        }
      />
      <Route
        path="/manageproducts"
        element={
          <Layout>
            <RoleGuard allowedRoles={[ROLE_ADMIN]}>
              <ManageProducts />
            </RoleGuard>
          </Layout>
        }
      />
      <Route
        path="/logs"
        element={
          <Layout>
            <RoleGuard allowedRoles={[ROLE_ADMIN]}>
              <Logs />
            </RoleGuard>
          </Layout>
        }
      />
      <Route
        path="/reports"
        element={
          <Layout>
            <RoleGuard allowedRoles={[ROLE_ADMIN, ROLE_PROCUREMENT_MANAGER]}>
              <Reports />
            </RoleGuard>
          </Layout>
        }
      />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

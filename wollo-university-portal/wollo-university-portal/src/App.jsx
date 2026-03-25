import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { LangProvider } from './contexts/LangContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Policies from './pages/Policies';
import PolicyDetail from './pages/PolicyDetail';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePolicies from './pages/admin/ManagePolicies';
import PolicyForm from './pages/admin/PolicyForm';
import VersionHistory from './pages/admin/VersionHistory';
import AuditLogs from './pages/admin/AuditLogs';
import BulkImport from './pages/admin/BulkImport';
import ManageAdmins from './pages/superadmin/ManageAdmins';
import SystemSettings from './pages/superadmin/SystemSettings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { getSettings } from './services/api';

// Apply system settings (theme) on app load
function SettingsLoader() {
  useEffect(() => {
    getSettings().then(res => {
      const s = res.data.data || res.data;
      if (s.default_theme && !localStorage.getItem('wu_theme')) {
        localStorage.setItem('wu_theme', s.default_theme);
        document.documentElement.setAttribute('data-theme', s.default_theme);
      }
    }).catch(() => {});
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <ThemeProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <SearchProvider>
              <SettingsLoader />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="policies" element={<Policies />} />
                  <Route path="policies/:id" element={<PolicyDetail />} />
                  <Route path="search" element={<SearchResults />} />
                  <Route path="about" element={<About />} />
                  <Route path="admin/login" element={<AdminLogin />} />

                  {/* Admin routes */}
                  <Route path="admin" element={<ProtectedRoute roles={['admin','super_admin']} />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="policies" element={<ManagePolicies />} />
                    <Route path="policies/new" element={<PolicyForm />} />
                    <Route path="policies/:id/edit" element={<PolicyForm />} />
                    <Route path="policies/:id/versions" element={<VersionHistory />} />
                    <Route path="import" element={<BulkImport />} />
                  </Route>

                  {/* Super Admin routes */}
                  <Route path="super-admin" element={<ProtectedRoute roles={['super_admin']} />}>
                    <Route path="admins" element={<ManageAdmins />} />
                    <Route path="settings" element={<SystemSettings />} />
                  </Route>

                  {/* Super Admin only — also under /admin prefix */}
                  <Route path="admin" element={<ProtectedRoute roles={['super_admin']} />}>
                    <Route path="audit-logs" element={<AuditLogs />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </SearchProvider>
            </AuthProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </LangProvider>
    </BrowserRouter>
  );
}

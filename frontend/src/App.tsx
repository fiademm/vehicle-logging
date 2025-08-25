import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import MainLayout from './components/layouts/MainLayout';

import ErrorBoundary from './components/ui/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './router/ProtectedRoute';
import './App.css';
import { Toaster } from 'react-hot-toast';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const VehicleLogsPage = lazy(() => import('./pages/VehicleLogsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const LogoutPage = lazy(() => import('./pages/LogoutPage'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/vehicle-logs" element={<VehicleLogsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/logout" element={<LogoutPage />} />
                </Route>
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
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

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout><DashboardPage /></MainLayout>} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
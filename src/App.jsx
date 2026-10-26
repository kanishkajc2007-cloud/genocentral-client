import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Datasets from './pages/Datasets';
import Pipelines from './pages/Pipelines';
import Reports from './pages/Reports';
import Collaboration from './pages/Collaboration';
import VariantExplorer from './pages/VariantExplorer';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/datasets"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Datasets />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/pipelines"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Pipelines />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/collaboration"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Collaboration />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/variant-explorer"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <VariantExplorer />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

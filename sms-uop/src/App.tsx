import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import RenewalPage from './pages/RenewalPage';
import RegistrationForm from './components/Registration/RegistrationForm';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanel from './pages/AdminPanel';
import AboutPage from './pages/AboutPage';
import EventPermissionPage from './pages/EventPermissionPage';
import GuidelinesPage from './pages/GuidelinesPage';
import HelpPage from './pages/HelpPage';

// Admin Route Protection
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
      <Router>
        <AuthProvider>
          <DataProvider>
            <div className="flex flex-col min-h-screen">
              {/* Header matches correct DB integration */}
              <Header />

              <main className="flex-grow bg-gray-50">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/register" element={<RegistrationForm />} />
                  <Route path="/renew" element={<RenewalPage />} />
                  <Route path="/events" element={<EventPermissionPage />} />
                  <Route path="/guidelines" element={<GuidelinesPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/about" element={<AboutPage />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                      path="/admin/*"
                      element={
                        <ProtectedAdminRoute>
                          <AdminPanel />
                        </ProtectedAdminRoute>
                      }
                  />
                </Routes>
              </main>

              {/* Footer matches correct DB integration */}
              <Footer />
            </div>
          </DataProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;
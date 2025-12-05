import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LandingPage from './components/LandingPage';
import EnrollmentPage from './components/Auth/EnrollmentPage';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import CustomerDashboard from './components/Customer/Dashboard';
import PalmManagement from './components/Customer/PalmManagement';
import CardsPage from './components/Customer/Cards';
import History from './components/Customer/History';
import Settings from './components/Customer/Settings';
import MerchantDashboard from './components/Merchant/Dashboard';
import POS from './components/Merchant/POS';

const ProtectedRoute: React.FC<{ children: React.ReactNode; userType?: 'customer' | 'merchant' }> = ({
  children,
  userType
}) => {
  const { user, merchant, userType: currentUserType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = user || merchant;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (userType && currentUserType !== userType) {
    return <Navigate to={currentUserType === 'customer' ? '/dashboard' : '/merchant/dashboard'} replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, merchant } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isAuthenticated = user || merchant;

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main className="flex-1 min-h-screen w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/enregistrement" element={<EnrollmentPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Customer Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute userType="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/palm"
              element={
                <ProtectedRoute userType="customer">
                  <PalmManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cards"
              element={
                <ProtectedRoute userType="customer">
                  <CardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute userType="customer">
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute userType="customer">
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute userType="customer">
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Support</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Merchant Routes */}
            <Route
              path="/merchant/dashboard"
              element={
                <ProtectedRoute userType="merchant">
                  <MerchantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/pos"
              element={
                <ProtectedRoute userType="merchant">
                  <POS />
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/products"
              element={
                <ProtectedRoute userType="merchant">
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des produits</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/payments"
              element={
                <ProtectedRoute userType="merchant">
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Historique des paiements</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/terminals"
              element={
                <ProtectedRoute userType="merchant">
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des terminaux</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/receipts"
              element={
                <ProtectedRoute userType="merchant">
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Reçus & exports</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/finances"
              element={
                <ProtectedRoute userType="merchant">
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Finances</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/integration"
              element={
                <ProtectedRoute userType="merchant">
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Intégration caisse</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/settings"
              element={
                <ProtectedRoute userType="merchant">
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/support"
              element={
                <ProtectedRoute userType="merchant">
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Support</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement</p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
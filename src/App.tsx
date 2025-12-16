import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LandingPage from './components/LandingPage';
import FAQ from './components/Public/FAQ';
import MentionsLegales from './components/Public/MentionsLegales';
import PolitiqueConfidentialite from './components/Public/PolitiqueConfidentialite';
import RequestTerminalPage from './components/Public/RequestTerminalPage';
import Contact from './components/Public/Contact';
import CGU from './components/Public/CGU';
import EnrollmentPage from './components/Auth/EnrollmentPage';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import CustomerDashboard from './components/Customer/Dashboard';
import PalmManagement from './components/Customer/PalmManagement';
import CardsPage from './components/Customer/Cards';
import History from './components/Customer/History';
import Settings from './components/Customer/Settings';
import CustomerSupport from './components/Customer/Support';
import MerchantDashboard from './components/Merchant/Dashboard';
import POS from './components/Merchant/POS';
import Payments from './components/Merchant/Payments';
import MerchantSettings from './components/Merchant/Settings';
import MerchantSupport from './components/Merchant/Support';
import Receipts from './components/Merchant/Receipts';
import Terminals from './components/Merchant/Terminals';
import Products from './components/Merchant/Products';
import MerchantFinances from './components/Merchant/Finances';

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
            <Route path="/faq" element={<FAQ />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/demander-boitier" element={<RequestTerminalPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cgu" element={<CGU />} />
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
                  <CustomerSupport />
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
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/payments"
              element={
                <ProtectedRoute userType="merchant">
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/terminals"
              element={
                <ProtectedRoute userType="merchant">
                  <Terminals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/receipts"
              element={
                <ProtectedRoute userType="merchant">
                  <Receipts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/finances"
              element={
                <ProtectedRoute userType="merchant">
                  <MerchantFinances />
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/settings"
              element={
                <ProtectedRoute userType="merchant">
                  <MerchantSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant/support"
              element={
                <ProtectedRoute userType="merchant">
                  <MerchantSupport />
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
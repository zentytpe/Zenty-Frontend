import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Hand,
  CreditCard,
  History,
  Settings,
  HelpCircle,
  BarChart3,
  ShoppingCart,
  Package,
  Receipt,
  Monitor,
  FileText,
  Banknote,
  Users,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const customerMenuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/dashboard' },
    { icon: Hand, label: 'Ma paume', path: '/palm' },
    { icon: CreditCard, label: 'Cartes bancaires', path: '/cards' },
    { icon: History, label: 'Historique', path: '/history' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '/support' }
  ];

  const merchantMenuItems = [
    { icon: BarChart3, label: 'Tableau de bord', path: '/merchant/dashboard' },
    { icon: ShoppingCart, label: 'Caisse', path: '/merchant/pos' },
    { icon: Package, label: 'Produits', path: '/merchant/products' },
    { icon: Receipt, label: 'Paiements', path: '/merchant/payments' },
    { icon: Monitor, label: 'Terminaux', path: '/merchant/terminals' },
    { icon: FileText, label: 'Reçus & exports', path: '/merchant/receipts' },
    { icon: Banknote, label: 'Finances', path: '/merchant/finances' },
    { icon: Users, label: 'Intégration', path: '/merchant/integration' },
    { icon: Settings, label: 'Paramètres', path: '/merchant/settings' },
    { icon: HelpCircle, label: 'Support', path: '/merchant/support' }
  ];

  const menuItems = userType === 'customer' ? customerMenuItems : merchantMenuItems;

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:shadow-sm lg:border-r lg:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 lg:hidden">
            <span className="text-xl font-bold text-gray-900">Menu</span>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
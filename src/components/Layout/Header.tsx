import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Store, Hand, Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, merchant, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentUser = user || merchant;
  const displayName = user ? `${user.firstName} ${user.lastName}` : merchant?.companyName;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Hand className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 hidden sm:block">Zenty</span>
            </div>
            {userType && (
              <div className="hidden md:flex items-center space-x-2 ml-8">
                {userType === 'customer' ? (
                  <User className="h-4 w-4 text-gray-500" />
                ) : (
                  <Store className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-600 capitalize">{userType}</span>
              </div>
            )}
          </div>

          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900">{displayName}</div>
                <div className="text-xs text-gray-500">{currentUser.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
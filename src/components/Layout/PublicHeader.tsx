import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hand } from 'lucide-react';

interface PublicHeaderProps {
  onLogin?: () => void;
  onRegister?: () => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ onLogin, onRegister }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/?login=1');
    }
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    } else {
      navigate('/?login=1');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
  <Hand className="h-8 w-8 text-blue-600 mt-1" />

  <div className="flex flex-col leading-tight">
    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
      ZENTY
    </span>

    <span className="text-xs font-medium bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
      Le paiement réinventé
    </span>
  </div>
</Link>


            <nav className="hidden md:flex space-x-6">
              <Link
                to="/demander-boitier"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Demander mon boîtier
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogin}
              className="text-gray-700 hover:text-gray-900 font-medium hidden sm:block"
            >
              Connexion
            </button>
            <button
              onClick={handleRegister}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;

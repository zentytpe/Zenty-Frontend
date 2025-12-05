import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginFormProps {
  userType: 'customer' | 'merchant';
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ userType, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, userType);
      if (success) {
        // Si un paramètre session_id est présent dans l'URL, rediriger vers la page d'autorisation
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');

        if (sessionId && userType === 'customer') {
          navigate(`/enregistrement?session_id=${sessionId}`);
        } else {
          navigate(userType === 'customer' ? '/dashboard' : '/merchant/dashboard');
        }
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
        <p className="text-gray-600 mt-2">
          {userType === 'customer' ? 'Connectez-vous à votre compte' : 'Accès commerçant'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="votre@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="text-right mt-1">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Connexion...</span>
            </>
          ) : (
            <span>Se connecter</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Pas encore de compte ? Créer un compte
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
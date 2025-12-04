import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hand, Shield, Zap, Users, ArrowRight, Check } from 'lucide-react';
import LoginForm from './Auth/LoginForm';
import RegisterForm from './Auth/RegisterForm';

const LandingPage: React.FC = () => {
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, merchant } = useAuth();

  // Ouvre automatiquement la modale de connexion si ?login=1
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('login')) {
      setShowAuth('login');
    }

    // Si l'utilisateur vient de se connecter et qu'un session_id existe, on le redirige
    const sessionId = params.get('session_id');
    if (sessionId && (user || merchant)) {
      navigate(`/enregistrement?session_id=${sessionId}`);
    }
  }, [location.search, user, merchant, navigate]);
  const [userType, setUserType] = useState<'customer' | 'merchant'>('customer');

  const features = [
    {
      icon: Zap,
      title: 'Paiement ultra-rapide',
      description: 'Payez en moins de 10 secondes, sans carte, sans téléphone'
    },
    {
      icon: Shield,
      title: 'Sécurité maximale',
      description: 'Biométrie avancée et chiffrement de bout en bout'
    },
    {
      icon: Users,
      title: 'Expérience simplifiée',
      description: 'Une seule paume pour tous vos paiements'
    }
  ];

  const stats = [
    { value: '10s', label: 'Temps de paiement' },
    { value: '99.9%', label: 'Taux de réussite' },
    { value: '500+', label: 'Commerçants partenaires' }
  ];

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <button
              onClick={() => setShowAuth(null)}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>← Retour à l'accueil</span>
            </button>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-sm">
              <div className="flex">
                <button
                  onClick={() => setUserType('customer')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    userType === 'customer'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Client
                </button>
                <button
                  onClick={() => setUserType('merchant')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    userType === 'merchant'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Commerçant
                </button>
              </div>
            </div>
          </div>

          {showAuth === 'login' ? (
            <LoginForm
              userType={userType}
              onSwitchToRegister={() => setShowAuth('register')}
            />
          ) : (
            <RegisterForm
              userType={userType}
              onSwitchToLogin={() => setShowAuth('login')}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Hand className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Zenty</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAuth('login')}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Connexion
              </button>
              <button
                onClick={() => setShowAuth('register')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Payez avec votre
              <span className="text-blue-600"> paume</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              La révolution du paiement biométrique. Sécurisé, instantané et sans contact.
              Votre paume devient votre nouveau moyen de paiement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAuth('register')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Commencer gratuitement</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Voir la démo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Zenty ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une technologie de pointe pour une expérience de paiement révolutionnaire
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Créez votre compte</h3>
                  <p className="text-gray-600">Inscription gratuite en 2 minutes avec votre email</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enregistrez votre paume</h3>
                  <p className="text-gray-600">Scan unique chez un commerçant partenaire</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payez instantanément</h3>
                  <p className="text-gray-600">Posez votre main, c'est payé en moins de 10 secondes</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full mb-6 shadow-lg">
                  <Hand className="h-16 w-16 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Votre paume = Votre portefeuille</h3>
                <p className="text-gray-600">Simple, sécurisé, révolutionnaire</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à révolutionner vos paiements ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà adopté Zenty
          </p>
          <button
            onClick={() => setShowAuth('register')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Créer mon compte gratuitement</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Hand className="h-6 w-6" />
                <span className="text-xl font-bold">Zenty</span>
              </div>
              <p className="text-gray-400">
                La révolution du paiement biométrique pour tous.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white">Sécurité</a></li>
                <li><a href="#" className="hover:text-white">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">À propos</a></li>
                <li><a href="#" className="hover:text-white">Carrières</a></li>
                <li><a href="#" className="hover:text-white">Presse</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Aide</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Statut</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Zenty. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
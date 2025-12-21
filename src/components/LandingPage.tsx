import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hand, Shield, Zap, Fingerprint, ShieldCheck, BadgeCheck, Users, ArrowRight, check } from 'lucide-react';
import PublicHeader from './Layout/PublicHeader';
import PublicFooter from './Layout/PublicFooter';
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
      icon: Fingerprint,
      title: 'Impossible à copier',
      description: 'Photo, vidéo, moulage, impression 3D.. rien ne fonctionne. Le capteur vérifie la présence d’un flux sanguin réel.'
    },
    {
      icon: ShieldCheck,
      title: 'Modèle crypté',
      description: 'Votre paume n’est jamais stockée. Aucune image n’est stockée, uniquement un modèle crypté.'
    },
    {
      icon: Users,
      title: 'Conçu pour la confiance',
      description: 'Conforme RGPD & standards biométriques internationaux.'
    }
  ];

  const stats = [
    { value: '⚡', label: 'Paiement en moins de 10 secondes, sans carte ni téléphone' },
    { value: '🔒', label: 'Le capteur vérifie la présence d’un flux sanguin réel. Impossible à copier ou falsifier' },
    { value: '🪄', label: 'Le premier moyen de paiement basé sur la reconnaissance veineuse en temps réel' }
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
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${userType === 'customer'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Utilisateur
                </button>
                <button
                  onClick={() => setUserType('merchant')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${userType === 'merchant'
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
      <PublicHeader
        onLogin={() => setShowAuth('login')}
        onRegister={() => setShowAuth('register')}
      />

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
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center flex-col">
                <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
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
      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default LandingPage;
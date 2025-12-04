import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Hand, CreditCard, History, TrendingUp, Check, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  paymentsThisMonth: number;
  totalAmount: string;
  lastUsed: string | null;
}

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  status: string;
}

interface PalmStatus {
  palmRegistered: boolean;
  verified: boolean;
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [palmStatus, setPalmStatus] = useState<PalmStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL_PROD || 'http://localhost:3000';

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('zenty_token');

        // Fetch stats, transactions, and palm status in parallel
        const [statsRes, transactionsRes, palmRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/users/${user._id}/stats`, {
            headers: { 'x-auth-token': token || '' }
          }),
          fetch(`${API_URL}/api/v1/users/${user._id}/transactions`, {
            headers: { 'x-auth-token': token || '' }
          }),
          fetch(`${API_URL}/api/v1/users/${user._id}/palm/status`, {
            headers: { 'x-auth-token': token || '' }
          })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }

        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData.transactions.slice(0, 3)); // Show only 3 most recent
        }

        if (palmRes.ok) {
          const palmData = await palmRes.json();
          setPalmStatus(palmData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, API_URL]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      if (hours === 0) return 'À l\'instant';
      return `Il y a ${hours}h`;
    } else if (hours < 48) {
      return `Hier ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    } else {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const statsConfig = [
    {
      title: 'Paiements ce mois',
      value: stats ? stats.paymentsThisMonth.toString() : '0',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Montant total',
      value: stats ? `€${stats.totalAmount}` : '€0.00',
      icon: CreditCard,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Dernière utilisation',
      value: stats?.lastUsed ? formatDate(stats.lastUsed) : 'Aucune',
      icon: History,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour {user?.firstName} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Voici un aperçu de votre activité Zenty
          </p>
        </div>
        {palmStatus && palmStatus.palmRegistered && (
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
            <Hand className="h-5 w-5" />
            <span className="font-medium">Paume enregistrée</span>
          </div>
        )}
        {palmStatus && !palmStatus.palmRegistered && (
          <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full">
            <Hand className="h-5 w-5" />
            <span className="font-medium">Paume non enregistrée</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsConfig.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/palm" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Hand className="h-8 w-8 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Gérer ma paume</p>
              <p className="text-sm text-gray-500">Statut et paramètres</p>
            </div>
          </Link>
          <Link to="/cards" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CreditCard className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Mes cartes</p>
              <p className="text-sm text-gray-500">Gérer mes paiements</p>
            </div>
          </Link>
          <Link to="/history" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <History className="h-8 w-8 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Historique</p>
              <p className="text-sm text-gray-500">Voir mes transactions</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Dernières transactions</h2>
          <Link to="/history" className="text-blue-600 hover:text-blue-700 font-medium">Voir tout</Link>
        </div>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune transaction pour le moment</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${transaction.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {transaction.status === 'completed' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.merchant}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">€{transaction.amount.toFixed(2)}</p>
                  <p className={`text-sm capitalize ${transaction.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.status === 'completed' ? 'Payé' : 'Échoué'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
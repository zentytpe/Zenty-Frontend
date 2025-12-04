import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  TrendingUp, 
  Euro, 
  Users, 
  Monitor, 
  BarChart3, 
  Hand,
  CreditCard,
  Calendar
} from 'lucide-react';

const MerchantDashboard: React.FC = () => {
  const { merchant } = useAuth();

  const stats = [
    {
      title: 'Paiements aujourd\'hui',
      value: '24',
      change: '+12%',
      icon: Hand,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Montant total',
      value: '€1,248.50',
      change: '+8%',
      icon: Euro,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Clients uniques',
      value: '18',
      change: '+5%',
      icon: Users,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'TPE en ligne',
      value: '3/3',
      change: '100%',
      icon: Monitor,
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const recentPayments = [
    {
      id: '1',
      customer: 'Marie D.',
      amount: 12.50,
      time: '14:30',
      terminal: 'TPE-001'
    },
    {
      id: '2',
      customer: 'Jean M.',
      amount: 25.80,
      time: '14:15',
      terminal: 'TPE-002'
    },
    {
      id: '3',
      customer: 'Sophie L.',
      amount: 8.30,
      time: '13:45',
      terminal: 'TPE-001'
    },
    {
      id: '4',
      customer: 'Pierre R.',
      amount: 15.90,
      time: '13:20',
      terminal: 'TPE-001'
    }
  ];

  const chartData = [
    { day: 'Lun', amount: 450 },
    { day: 'Mar', amount: 680 },
    { day: 'Mer', amount: 920 },
    { day: 'Jeu', amount: 1200 },
    { day: 'Ven', amount: 1400 },
    { day: 'Sam', amount: 1800 },
    { day: 'Dim', amount: 1250 }
  ];

  const maxAmount = Math.max(...chartData.map(d => d.amount));

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenue chez {merchant?.companyName}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
          <Monitor className="h-5 w-5" />
          <span className="font-medium">Tous les terminaux en ligne</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 font-medium">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Recent Payments */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">7 derniers jours</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {chartData.map((data) => (
              <div key={data.day} className="flex items-center space-x-4">
                <div className="w-8 text-sm text-gray-600 font-medium">{data.day}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-900 font-medium text-right">
                  €{data.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Derniers paiements</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Voir tout</button>
          </div>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Hand className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{payment.customer}</p>
                    <p className="text-sm text-gray-500">{payment.terminal} • {payment.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">€{payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-green-600">Payé</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Nouvelle vente</p>
              <p className="text-sm text-gray-500">Caisse en ligne</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Hand className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Enregistrer une paume</p>
              <p className="text-sm text-gray-500">Nouveau client</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Rapport mensuel</p>
              <p className="text-sm text-gray-500">Télécharger</p>
            </div>
          </button>
        </div>
      </div>

      {/* System Message */}
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900">Message système</h3>
            <p className="text-blue-800 mt-1">
              Votre dernier virement de €2,450.80 a été effectué avec succès le 19 janvier 2024. 
              Le prochain virement est prévu pour le 26 janvier 2024.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
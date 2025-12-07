import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  TrendingUp,
  Euro,
  Users,
  Monitor,
  BarChart3,
  Hand
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface DashboardStats {
  todayPayments: number;
  totalAmount: number;
  uniqueClients: number;
  onlineTerminals: string;
}

interface Payment {
  _id: string;
  userId?: {
    firstName: string;
    lastName: string;
  };
  amount: number;
  createdAt: string;
  terminalId?: {
    terminalUid: string;
    name: string;
  };
  status: string;
}

interface ChartDataItem {
  day: string;
  amount: number;
  date: string;
}

const MerchantDashboard: React.FC = () => {
  const { merchant } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todayPayments: 0,
    totalAmount: 0,
    uniqueClients: 0,
    onlineTerminals: '0'
  });
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!merchant?._id) return;

      try {
        const token = localStorage.getItem('zenty_token');
        const response = await fetch(`${API_URL}/api/v1/merchants/${merchant._id}/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token || ''
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.stats);
            setRecentPayments(data.recentPayments);
            setChartData(data.chartData);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [merchant?._id]);

  const statCards = [
    {
      title: 'Paiements aujourd\'hui',
      value: stats.todayPayments.toString(),
      // change: '+12%', // Need historical comparison for this
      icon: Hand,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Montant total (Aujourd\'hui)',
      value: `€${stats.totalAmount.toFixed(2)}`,
      // change: '+8%',
      icon: Euro,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Clients uniques',
      value: stats.uniqueClients.toString(),
      // change: '+5%',
      icon: Users,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'TPE en ligne',
      value: stats.onlineTerminals,
      // change: '100%',
      icon: Monitor,
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const maxAmount = Math.max(...chartData.map(d => d.amount), 100); // Avoid division by zero

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {/* <p className="text-sm text-green-600 font-medium">{stat.change}</p> */}
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
                  €{data.amount.toFixed(0)}
                </div>
              </div>
            ))}
            {chartData.length === 0 && <p className="text-gray-500 text-center">Aucune donnée disponible</p>}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Derniers paiements</h2>
            <button
              onClick={() => navigate('/merchant/payments')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Hand className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.userId ? `${payment.userId.firstName} ${payment.userId.lastName}` : 'Anonyme'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.terminalId?.name || 'Inconnu'} • {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">€{payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-green-600">
                    {payment.status === 'completed' ? 'Payé' : payment.status}
                  </p>
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && <p className="text-gray-500 text-center">Aucun paiement récent</p>}
          </div>
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
              Les virements sont effectués automatiquement chaque semaine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
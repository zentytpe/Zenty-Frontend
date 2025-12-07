import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Search,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    MoreVertical,
    Hand
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface Payment {
    _id: string;
    userId?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    amount: number;
    currency: string;
    createdAt: string;
    terminalId?: {
        terminalUid: string;
        name: string;
        location: string;
    };
    status: string;
    description?: string;
}

const Payments: React.FC = () => {
    const { merchant } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            if (!merchant?._id) return;

            try {
                const token = localStorage.getItem('zenty_token');
                const response = await fetch(`${API_URL}/api/v1/merchants/${merchant._id}/transactions`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-auth-token': token || ''
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setPayments(data.transactions);
                    }
                }
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [merchant?._id]);

    const filteredPayments = payments.filter(payment => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();

        const amountMatch = payment.amount.toString().includes(searchTerm);
        const userMatch = payment.userId
            ? `${payment.userId.firstName} ${payment.userId.lastName}`.toLowerCase().includes(searchLower)
            : false;
        const terminalMatch = payment.terminalId?.name.toLowerCase().includes(searchLower);

        return amountMatch || userMatch || terminalMatch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des paiements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Historique des transactions</h1>
                    <p className="text-gray-600 mt-1">Consultez tous les paiements reçus</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white">
                        <Download className="h-4 w-4" />
                        <span>Exporter</span>
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par montant, client ou terminal..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white">
          <Filter className="h-4 w-4" />
          <span>Filtres</span>
        </button> */}
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terminal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.map((payment) => (
                                <tr key={payment._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Hand className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Paiement par paume</div>
                                                <div className="text-sm text-gray-500">ID: {payment._id.slice(-8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {payment.userId ? `${payment.userId.firstName} ${payment.userId.lastName}` : 'Client Anonyme'}
                                        </div>
                                        {payment.userId?.email && <div className="text-sm text-gray-500">{payment.userId.email}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.terminalId?.name || 'Inconnu'}</div>
                                        <div className="text-sm text-gray-500">{payment.terminalId?.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : payment.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {payment.status === 'completed' ? 'Payé' : payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <span className='text-gray-900 font-bold'>
                                            €{payment.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        Aucune transaction trouvée
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Affichage de {filteredPayments.length} transactions</p>
                </div>
            </div>
        </div>
    );
};

export default Payments;

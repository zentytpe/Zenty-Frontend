import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Search, Filter, Download, Check, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Transaction {
    id: string;
    merchant: string;
    amount: number;
    date: string;
    status: string;
    payment_method: string;
    description: string;
}

const History: React.FC = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user?._id) return;

            try {
                setLoading(true);
                const token = localStorage.getItem('zenty_token');
                const response = await fetch(`${API_URL}/api/v1/users/${user._id}/transactions`, {
                    headers: {
                        'x-auth-token': token || ''
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des transactions');
                }

                const data = await response.json();
                setTransactions(data.transactions);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Impossible de charger votre historique');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [user, API_URL]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredTransactions = transactions.filter(t =>
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour au tableau de bord
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Historique des paiements</h1>
                        <p className="text-gray-600 mt-1">Consultez et gérez vos transactions passées</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                            <Download className="h-4 w-4 mr-2" />
                            Exporter
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une transaction..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtres
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {error ? (
                    <div className="p-8 text-center text-red-600 bg-red-50">
                        {error}
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Aucune transaction trouvée</h3>
                        <p className="text-gray-500 mt-1">Essayez de modifier vos critères de recherche</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marchand</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moyen de paiement</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {transaction.status === 'completed' ? (
                                                    <>
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Payé
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="h-3 w-3 mr-1" />
                                                        Échoué
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{transaction.merchant}</div>
                                            <div className="text-sm text-gray-500">{transaction.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.payment_method}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                            €{transaction.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;

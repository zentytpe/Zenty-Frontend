import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Search,
    Download,
    ArrowDownToLine,
    Loader2,
    AlertCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface Transaction {
    _id: string;
    createdAt: string;
    userId?: {
        firstName: string;
        lastName: string;
        email?: string;
    };
    amount: number;
    currency: string;
    terminalId?: {
        name: string;
        terminalUid: string;
    };
    status: string;
}

interface TransactionsResponse {
    transactions: Transaction[];
    count: number;
}

const Receipts = () => {
    const { merchant } = useAuth();
    const [data, setData] = useState<TransactionsResponse>({ transactions: [], count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        start: '',
        end: '',
        search: ''
    });
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportRange, setExportRange] = useState({ start: '', end: '' });

    const fetchTransactions = async () => {
        if (!merchant?._id) return;

        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('zenty_token'); // Corrected token key

            let url = `${API_URL}/api/v1/merchants/${merchant._id}/transactions`;
            const params = new URLSearchParams();
            if (filters.start) params.append('start', filters.start);
            if (filters.end) params.append('end', filters.end);
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token || ''
                }
            });

            if (!res.ok) throw new Error('Failed to fetch transactions');

            const result = await res.json();
            setData(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Impossible de charger les transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters.start, filters.end, merchant?._id]);

    const handleDownloadPdf = async (transactionId: string) => {
        try {
            const token = localStorage.getItem('zenty_token');
            const res = await fetch(`${API_URL}/api/v1/merchants/transactions/${transactionId}/receipt`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token || ''
                }
            });

            if (!res.ok) throw new Error('Failed to download PDF');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `receipt-${transactionId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error(err);
            alert('Erreur lors du téléchargement du reçu');
        }
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem('zenty_token');
            if (!merchant?._id) return;

            let url = `${API_URL}/api/v1/merchants/${merchant._id}/transactions/export`;
            const params = new URLSearchParams();
            if (exportRange.start) params.append('start', exportRange.start);
            if (exportRange.end) params.append('end', exportRange.end);
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token || ''
                }
            });

            if (!res.ok) throw new Error('Export failed');

            const blob = await res.blob();
            const urlObj = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlObj;
            a.download = `export-${exportRange.start || 'all'}-${exportRange.end || 'current'}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setShowExportModal(false);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'export');
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Reçus & Exports</h2>
                    <p className="text-gray-600 mt-1">Gérez vos reçus et exportez vos données comptables</p>
                </div>
                <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white"
                >
                    <Download className="h-4 w-4" />
                    <span>Export Global</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par client..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    // Note: Search not implemented in backend yet
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Du:</span>
                    <input
                        type="date"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        value={filters.start}
                        onChange={(e) => setFilters({ ...filters, start: e.target.value })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Au:</span>
                    <input
                        type="date"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        value={filters.end}
                        onChange={(e) => setFilters({ ...filters, end: e.target.value })}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : error ? (
                    <div className="flex flex-col justify-center items-center h-64 text-red-500 gap-2">
                        <AlertCircle size={32} />
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TPE</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Aucune transaction trouvée</td>
                                    </tr>
                                ) : (
                                    data.transactions.map((tx) => (
                                        <tr key={tx._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {tx.userId ? `${tx.userId.firstName} ${tx.userId.lastName}` : 'Client Inconnu'}
                                                </div>
                                                {tx.userId?.email && <div className="text-sm text-gray-500">{tx.userId.email}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                {tx.amount} {tx.currency}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{tx.terminalId?.name || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{tx.terminalId?.terminalUid}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${tx.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : tx.status === 'failed'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {tx.status === 'completed' ? 'Payé' : tx.status === 'failed' ? 'Échoué' : 'En cours'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDownloadPdf(tx._id)}
                                                    className="text-gray-400 hover:text-blue-600 transition p-2 rounded-full hover:bg-blue-50"
                                                    title="Télécharger le reçu"
                                                >
                                                    <ArrowDownToLine size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold mb-4">Exporter les transactions</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                                <input
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                                    value={exportRange.start}
                                    onChange={(e) => setExportRange({ ...exportRange, start: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                                <input
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                                    value={exportRange.end}
                                    onChange={(e) => setExportRange({ ...exportRange, end: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Exporter CSV
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Receipts;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Banknote,
    CreditCard,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    Save,
    Edit2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface Payout {
    _id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed';
    iban: string;
    createdAt: string;
    processedAt?: string;
}

const Finances: React.FC = () => {
    const { merchant } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [pendingBalance, setPendingBalance] = useState(0);
    const [iban, setIban] = useState('');
    const [payouts, setPayouts] = useState<Payout[]>([]);

    // Edit mode for IBAN
    const [isEditingIban, setIsEditingIban] = useState(false);
    const [newIban, setNewIban] = useState('');
    const [savingIban, setSavingIban] = useState(false);

    useEffect(() => {
        if (merchant) {
            fetchFinances();
        }
    }, [merchant]);

    const fetchFinances = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/v1/merchants/${merchant?._id}/finances`, {
                headers: {
                    'x-auth-token': localStorage.getItem('zenty_token') || ''
                }
            });

            const data = await res.json();

            if (data.success) {
                setPendingBalance(data.pendingBalance);
                setIban(data.iban);
                setNewIban(data.iban);
                setPayouts(data.payouts);
            }
        } catch (err) {
            console.error(err);
            setError('Impossible de charger les données financières.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveIban = async () => {
        try {
            setSavingIban(true);
            setError(null);
            setSuccessMsg(null);

            // Basic validation
            if (newIban.length < 10) {
                setError("L'IBAN semble invalide.");
                setSavingIban(false);
                return;
            }

            const res = await fetch(`${API_URL}/api/v1/merchants/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('zenty_token') || ''
                },
                body: JSON.stringify({ iban: newIban })
            });

            const data = await res.json();

            if (data.success) {
                setIban(newIban);
                setIsEditingIban(false);
                setSuccessMsg('IBAN mis à jour avec succès.');
                setTimeout(() => setSuccessMsg(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la mise à jour de l'IBAN.");
        } finally {
            setSavingIban(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" /> Payé
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" /> En attente
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" /> Échoué
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Banknote className="mr-3 h-8 w-8 text-blue-600" />
                    Finances
                </h1>
                <p className="mt-1 text-gray-500">
                    Gérez vos informations bancaires et consultez vos versements.
                </p>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {successMsg && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{successMsg}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
                {/* Balance Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Banknote className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Solde en attente de versement</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {pendingBalance.toFixed(2)} €
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                    </div>
                </div>

                {/* IBAN Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CreditCard className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Coordonnées bancaires</h3>
                                </div>
                            </div>
                            {!isEditingIban ? (
                                <button
                                    onClick={() => setIsEditingIban(true)}
                                    className="text-sm text-blue-600 hover:text-blue-900 flex items-center"
                                >
                                    <Edit2 className="w-4 h-4 mr-1" /> Modifier
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsEditingIban(false);
                                        setNewIban(iban);
                                    }}
                                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                                >
                                    <XCircle className="w-4 h-4 mr-1" /> Annuler
                                </button>
                            )}
                        </div>

                        <div className="ml-11">
                            {isEditingIban ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newIban}
                                        onChange={(e) => setNewIban(e.target.value.toUpperCase())}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        placeholder="FR76 ..."
                                    />
                                    <button
                                        onClick={handleSaveIban}
                                        disabled={savingIban}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {savingIban ? '...' : <Save className="w-4 h-4" />}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">IBAN enregistré</p>
                                    <p className="mt-1 text-lg text-gray-900 font-mono">
                                        {iban || 'Aucun IBAN enregistré'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payout History */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Historique des virements</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Liste des derniers virements effectués vers votre compte bancaire.</p>
                    </div>
                    {/* Could add export button here later */}
                </div>
                <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Montant
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        IBAN
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payouts.length > 0 ? (
                                    payouts.map((payout) => (
                                        <tr key={payout._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(payout.createdAt).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {payout.amount.toFixed(2)} {payout.currency}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {payout.iban}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(payout.status)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                            Aucun virement pour le moment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finances;

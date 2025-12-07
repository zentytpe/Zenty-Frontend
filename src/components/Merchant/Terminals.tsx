import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Monitor,
    RefreshCw,
    Search,
    Wifi,
    WifiOff,
    AlertTriangle,
    MapPin,
    Clock,
    Plus
} from 'lucide-react';

// Using environment variable for API URL
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface Terminal {
    _id: string;
    terminalUid: string;
    name: string;
    location?: string;
    status: 'active' | 'inactive' | 'maintenance';
    lastPingAt?: string;
    merchantId?: string;
}

const Terminals: React.FC = () => {
    const { merchant } = useAuth();
    const [terminals, setTerminals] = useState<Terminal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Add Terminal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTerminalName, setNewTerminalName] = useState('');
    const [newTerminalLocation, setNewTerminalLocation] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const fetchTerminals = async () => {
        if (!merchant?._id) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('zenty_token');
            const response = await fetch(`${API_URL}/api/v1/merchants/${merchant._id}/terminals`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token || ''
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des terminaux');
            }

            const data = await response.json();
            if (data.success) {
                setTerminals(data.terminals);
            } else {
                setError(data.msg || 'Erreur inconnue');
            }
        } catch (err: any) {
            console.error('Error fetching terminals:', err);
            setError(err.message || 'Impossible de charger les terminaux');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTerminal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!merchant?._id) return;

        setIsAdding(true);
        setError(null);

        try {
            const token = localStorage.getItem('zenty_token');
            const response = await fetch(`${API_URL}/api/v1/merchants/${merchant._id}/terminals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    name: newTerminalName,
                    location: newTerminalLocation
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Erreur lors de l'ajout du terminal");
            }

            if (data.success) {
                // Add new terminal to list
                setTerminals([data.terminal, ...terminals]);
                // Reset form and close modal
                setNewTerminalName('');
                setNewTerminalLocation('');
                setIsAddModalOpen(false);
            }
        } catch (err: any) {
            console.error('Error adding terminal:', err);
            setError(err.message || "Impossible d'ajouter le terminal");
        } finally {
            setIsAdding(false);
        }
    };

    useEffect(() => {
        fetchTerminals();
    }, [merchant?._id]);

    const getStatusBadge = (status: string) => {
        // Logic to determine if online based on lastPingAt (e.g., within 5 mins)
        //const isOnline = lastPingAt && (new Date().getTime() - new Date(lastPingAt).getTime() < 5 * 60 * 1000);

        // Check if status in DB is active, but maybe offline effectively
        // For now using the DB status mixed with online check visualization

        if (status === 'maintenance') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Maintenance
                </span>
            );
        }

        if (status === 'active') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Wifi className="w-3 h-3 mr-1" />
                    En ligne
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <WifiOff className="w-3 h-3 mr-1" />
                Inactif
            </span>
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Jamais';
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredTerminals = terminals.filter(term =>
        term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.terminalUid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (term.location && term.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Terminaux</h1>
                    <p className="text-gray-600 mt-1">Gérez vos terminaux de paiement</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un terminal
                </button>
            </div>

            <div className="bg-white shadow border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Rechercher par nom, ID ou lieu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchTerminals}
                        title="Rafraîchir"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-100">
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Terminal
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lieu
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    État
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dernière activité
                                </th>
                                {/* <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && terminals.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                        Chargement des terminaux...
                                    </td>
                                </tr>
                            ) : filteredTerminals.length > 0 ? (
                                filteredTerminals.map((terminal) => (
                                    <tr key={terminal._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
                                                    <Monitor className="h-6 w-6" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{terminal.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {terminal.terminalUid}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                {terminal.location || 'Non spécifié'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(terminal.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                {formatDate(terminal.lastPingAt)}
                                            </div>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900">Configure</a>
                    </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                        {!loading && (searchTerm ? 'Aucun terminal ne correspond à votre recherche' : 'Aucun terminal trouvé associe à ce compte marchand.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Terminal Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsAddModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <Monitor className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Ajouter un nouveau terminal
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Renseignez les informations du nouveau terminal ci-dessous.
                                        </p>
                                        <form className="mt-4 space-y-4" onSubmit={handleAddTerminal}>
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du terminal</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    required
                                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                                    placeholder="Ex: Caisse Principale"
                                                    value={newTerminalName}
                                                    onChange={(e) => setNewTerminalName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Emplacement (optionnel)</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    id="location"
                                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                                    placeholder="Ex: Paris, Boutique 1"
                                                    value={newTerminalLocation}
                                                    onChange={(e) => setNewTerminalLocation(e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={isAdding}
                                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${isAdding ? 'opacity-75 cursor-not-allowed' : ''}`}
                                                >
                                                    {isAdding ? 'Ajout...' : 'Ajouter'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                    onClick={() => setIsAddModalOpen(false)}
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Terminals;

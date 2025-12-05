import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Save, Loader2, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear message when user starts typing
        if (message) setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('zenty_token');
            const response = await fetch(`${API_URL}/api/v1/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg || 'Erreur lors de la mise à jour');
            }

            const updatedUser = await response.json();
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });

            // Update local storage user data if needed
            // You might want to trigger a refresh in AuthContext here
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour du profil' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('zenty_token');
            const response = await fetch(`${API_URL}/api/v1/users/${user?._id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token || ''
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg || 'Erreur lors de la suppression');
            }

            // Logout and redirect
            logout();
            navigate('/', { replace: true });
        } catch (err: any) {
            console.error('Error deleting account:', err);
            setMessage({ type: 'error', text: err.message || 'Erreur lors de la suppression du compte' });
            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-gray-600 mt-1">Gérez les informations de votre compte</p>
            </div>

            {/* Profile Settings Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <User className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Success/Error Message */}
                    {message && (
                        <div className={`p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.type === 'success' && <CheckCircle className="h-5 w-5" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Votre prénom"
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Votre nom"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="votre.email@exemple.com"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+33 6 12 34 56 78"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Enregistrement...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    <span>Enregistrer les modifications</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Account Info */}
            <div className="mt-6 bg-blue-50 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                    <User className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-medium text-blue-900 mb-2">À propos de votre compte</h3>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            Votre compte Zenty vous permet de payer facilement avec votre paume dans tous les commerces partenaires.
                            Vos informations personnelles sont sécurisées et ne sont jamais partagées.
                        </p>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-red-200 bg-red-100">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <h2 className="text-xl font-semibold text-red-900">Zone de danger</h2>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="font-medium text-red-900 mb-2">Supprimer mon compte</h3>
                    <p className="text-red-800 text-sm mb-4">
                        La suppression de votre compte est définitive. Toutes vos données personnelles,
                        palmes enregistrées et moyens de paiement seront supprimés de manière irréversible.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
                    >
                        <Trash2 className="h-5 w-5" />
                        <span>Supprimer mon compte</span>
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Êtes-vous absolument sûr de vouloir supprimer votre compte ? Cette action est
                            <strong className="text-red-600"> irréversible</strong> et toutes vos données seront
                            définitivement perdues.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Suppression...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-5 w-5" />
                                        <span>Supprimer définitivement</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;

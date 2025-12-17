import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Save, Loader2, CheckCircle, Trash2, AlertTriangle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
    const { user, logout, refreshUser } = useAuth();
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Veuillez sélectionner une image valide (JPG, PNG)' });
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 5MB' });
            return;
        }

        setUploadingImage(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const token = localStorage.getItem('zenty_token');
            const response = await fetch(`${API_URL}/api/v1/users/profile/picture`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token || ''
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg || 'Erreur lors du téléchargement de l\'image');
            }

            // Refresh user data from server to get updated profilePicture
            await refreshUser();

            setMessage({ type: 'success', text: 'Photo de profil mise à jour !' });
        } catch (err: any) {
            console.error('Error uploading image:', err);
            setMessage({ type: 'error', text: err.message || 'Erreur lors du téléchargement' });
        } finally {
            setUploadingImage(false);
        }
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
            const currentUser = JSON.parse(localStorage.getItem('zenty_user') || '{}');
            const newUserData = { ...currentUser, ...updatedUser };
            localStorage.setItem('zenty_user', JSON.stringify(newUserData));

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

                <div className="p-6 space-y-8">
                    {/* Success/Error Message */}
                    {message && (
                        <div className={`p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.type === 'success' && <CheckCircle className="h-5 w-5" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-100">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 relative bg-gray-100 flex items-center justify-center">
                                {user?.profilePicture ? (
                                    <img
                                        src={`${API_URL}${user.profilePicture}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=random';
                                        }}
                                    />
                                ) : (
                                    <User className="h-16 w-16 text-gray-400" />
                                )}

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                    <Camera className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100" />
                                </div>
                            </div>

                            {/* Edit badge */}
                            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-4 border-white shadow-sm group-hover:bg-blue-700 transition-colors">
                                <Camera className="h-4 w-4 text-white" />
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />

                        <div className="mt-4 text-center">
                            <p className="text-sm font-medium text-gray-700">Photo de profil</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {uploadingImage ? 'Téléchargement...' : 'Cliquez pour modifier (JPG, PNG, max 5MB)'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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

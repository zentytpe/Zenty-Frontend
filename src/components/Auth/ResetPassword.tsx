import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Token de réinitialisation manquant');
        }
    }, [token]);

    const validatePassword = () => {
        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validatePassword()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/', { state: { message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.' } });
                }, 3000);
            } else {
                setError(data.msg || 'Une erreur est survenue');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lien invalide</h2>
                        <p className="text-gray-600 mb-6">
                            Ce lien de réinitialisation est invalide ou a expiré.
                        </p>
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Demander un nouveau lien
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mot de passe réinitialisé !</h2>
                        <p className="text-gray-600 mb-6">
                            Votre mot de passe a été réinitialisé avec succès.
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirection vers la page de connexion...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Nouveau mot de passe</h2>
                    <p className="text-gray-600 mt-2">
                        Choisissez un nouveau mot de passe sécurisé pour votre compte
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="••••••••"
                                required
                                minLength={8}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Au moins 8 caractères</p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Réinitialisation...</span>
                            </>
                        ) : (
                            <span>Réinitialiser le mot de passe</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

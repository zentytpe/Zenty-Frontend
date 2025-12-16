import React, { useState } from 'react';
import { Check, ArrowRight, Loader2, Lock } from 'lucide-react';
import PublicHeader from '../Layout/PublicHeader';
import PublicFooter from '../Layout/PublicFooter';

const RequestTerminalPage: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        businessName: '',
        city: '',
        email: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/api/v1/contact/request-terminal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            setSuccess(true);
            setFormData({
                fullName: '',
                businessName: '',
                city: '',
                email: '',
                phone: ''
            });
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PublicHeader />

            <main className="flex-grow">
                <section className="bg-white py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center max-w-3xl mx-auto mb-16">
                            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
                                Rejoignez les premiers commerces équipés Zenty
                            </h1>
                            <p className="mt-4 text-xl text-blue-600 font-medium">
                                Bénéficiez en avant-première du paiement par paume dans votre établissement.
                            </p>
                            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                                Zenty déploie une série limitée de boîtiers pour ses commerces pilotes.
                                Inscrivez-vous pour être contacté en priorité lors du déploiement dans votre ville.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2">

                                {/* Left Side: Benefits */}
                                <div className="p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Pourquoi rejoindre le programme pilote ?</h3>
                                    <ul className="space-y-6">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                                                    <Check className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <p className="ml-4 text-lg text-gray-700">
                                                Encaissement en moins de 10 secondes, sans carte ni téléphone
                                            </p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                                                    <Check className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <p className="ml-4 text-lg text-gray-700">
                                                Expérience futuriste qui attire l’attention des clients
                                            </p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                                                    <Check className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <p className="ml-4 text-lg text-gray-700">
                                                Technologie sécurisée — Conforme RGPD — Aucun stockage de photo brute
                                            </p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                                                    <Check className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <p className="ml-4 text-lg text-gray-700">
                                                Installation simple, accompagnement Zenty de A à Z
                                            </p>
                                        </li>
                                    </ul>
                                </div>

                                {/* Right Side: Form */}
                                <div className="p-8 sm:p-12 lg:p-16 bg-white">
                                    {success ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                                <Check className="h-10 w-10 text-green-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Demande envoyée !</h3>
                                            <p className="text-gray-600 mb-8 max-w-sm">
                                                Merci de votre intérêt pour Zenty. Notre équipe vous contactera pour finaliser votre demande.
                                            </p>
                                            <button
                                                onClick={() => setSuccess(false)}
                                                className="text-blue-600 font-medium hover:text-blue-700 underline"
                                            >
                                                Envoyer une autre demande
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-8">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pré-réservation</h3>
                                                <p className="text-gray-600">Remplissez ce formulaire pour être recontacté.</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                                    <div>
                                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nom et Prénom</label>
                                                        <input
                                                            type="text"
                                                            name="fullName"
                                                            id="fullName"
                                                            required
                                                            value={formData.fullName}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Jean Dupont"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Nom du commerce</label>
                                                        <input
                                                            type="text"
                                                            name="businessName"
                                                            id="businessName"
                                                            required
                                                            value={formData.businessName}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Boulangerie Délices"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        id="city"
                                                        required
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Paris"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email professionnel</label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            id="email"
                                                            required
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="contact@commerce.com"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            id="phone"
                                                            required
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="06 12 34 56 78"
                                                        />
                                                    </div>
                                                </div>

                                                {error && (
                                                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                                                        {error}
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                            Envoi en cours...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Pré-réserver mon boîtier Zenty
                                                            <ArrowRight className="ml-2 h-5 w-5" />
                                                        </>
                                                    )}
                                                </button>

                                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <Lock className="h-4 w-4 text-gray-400" />
                                                    <span>Les premiers inscrits seront prioritaires lors du déploiement.</span>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
};

export default RequestTerminalPage;

import React, { useState } from 'react';
import { Send, Loader2, Mail, MapPin } from 'lucide-react';
import PublicHeader from '../Layout/PublicHeader';
import PublicFooter from '../Layout/PublicFooter';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        userType: 'private',
        subject: '',
        message: '',
        privacyAccepted: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            privacyAccepted: e.target.checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.privacyAccepted) {
            setError('Vous devez accepter la politique de confidentialité pour envoyer ce formulaire.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/api/v1/contact/submit`, {
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
                lastName: '',
                firstName: '',
                email: '',
                phone: '',
                userType: 'private',
                subject: '',
                message: '',
                privacyAccepted: false
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
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
                                Contactez-nous
                            </h1>
                            <p className="mt-4 text-xl text-gray-600">
                                Une question ? Un projet ? Notre équipe est là pour vous répondre.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Contact Info */}
                            <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm h-fit">
                                <h3 className="text-2xl font-bold text-gray-900 mb-8">Informations</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm text-blue-600">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-medium text-gray-900">Email</p>
                                            <p className="text-gray-600">
                                                <a href="mailto:contact@zenty.fr" className="hover:text-blue-600">contact@zenty.fr</a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm text-blue-600">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-medium text-gray-900">Adresse</p>
                                            <p className="text-gray-600">
                                                Paris, France
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12">
                                {success ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                            <Send className="h-10 w-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Message envoyé !</h3>
                                        <p className="text-gray-600 mb-8 max-w-sm">
                                            Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                                        </p>
                                        <button
                                            onClick={() => setSuccess(false)}
                                            className="text-blue-600 font-medium hover:text-blue-700 underline"
                                        >
                                            Envoyer un autre message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    placeholder="Dupont"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    placeholder="Jean"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    placeholder="jean.dupont@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    placeholder="06 12 34 56 78"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <span className="block text-sm font-medium text-gray-700 mb-3">Vous êtes :</span>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {[
                                                    { id: 'private', label: 'Particulier' },
                                                    { id: 'merchant', label: 'Commerçant' },
                                                    { id: 'partner', label: 'Partenaire' },
                                                    { id: 'other', label: 'Autre' }
                                                ].map((type) => (
                                                    <label key={type.id} className="relative flex cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="userType"
                                                            value={type.id}
                                                            checked={formData.userType === type.id}
                                                            onChange={handleChange}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-full p-3 text-center border rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 transition-all">
                                                            <div className="text-sm font-medium">{type.label}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                id="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                placeholder="L'objet de votre message"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                            <textarea
                                                name="message"
                                                id="message"
                                                rows={5}
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                placeholder="Votre message..."
                                            />
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id="privacyAccepted"
                                                    name="privacyAccepted"
                                                    type="checkbox"
                                                    required
                                                    checked={formData.privacyAccepted}
                                                    onChange={handleCheckboxChange}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="privacyAccepted" className="font-medium text-gray-700">
                                                    J’accepte que mes données soient utilisées pour être recontacté(e) conformément à la <Link to="/politique-confidentialite" className="text-blue-600 hover:text-blue-500 hover:underline">Politique de confidentialité</Link>.
                                                </label>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center">
                                                <span className="mr-2">⚠️</span> {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    Envoyer le message
                                                    <Send className="ml-2 h-5 w-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
};

export default Contact;

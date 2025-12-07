import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, ChevronDown, ChevronUp, Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const Support: React.FC = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    const faqs = [
        {
            question: "Comment changer mes informations bancaires ?",
            answer: "Pour modifier vos informations bancaires, rendez-vous dans l'onglet 'Paramètres' puis 'Finances'. Vous pourrez y mettre à jour votre IBAN et vos préférences de virement."
        },
        {
            question: "Combien de temps prennent les virements vers mon compte ?",
            answer: "Les virements sont effectués automatiquement chaque jour ouvrable (J+1). Selon votre banque, les fonds peuvent apparaître sur votre compte sous 24 à 48 heures."
        },
        {
            question: "Comment ajouter un nouveau terminal de paiement ?",
            answer: "Allez dans l'onglet 'Terminaux' et cliquez sur 'Ajouter un terminal'. Suivez les instructions pour associer votre nouvel appareil à votre compte commerçant."
        },
        {
            question: "Que faire en cas de problème technique avec un terminal ?",
            answer: "Vérifiez d'abord votre connexion internet. Si le problème persiste, redémarrez le terminal. En cas de blocage, contactez notre support via le formulaire ci-dessous ou par téléphone."
        },
        {
            question: "Où trouver mes factures mensuelles ?",
            answer: "Vos factures de commission et de services sont disponibles dans l'onglet 'Finances', section 'Factures'. Vous pouvez les télécharger au format PDF."
        }
    ];

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSubmitStatus(null);

        try {
            const token = localStorage.getItem('zenty_token');
            const response = await fetch(`${API_URL}/api/v1/support/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue lors de l\'envoi du message.');
            }

            setSubmitStatus({
                type: 'success',
                text: 'Votre message a bien été envoyé. Notre équipe vous répondra dans les plus brefs délais.'
            });
            setFormData({ subject: '', message: '' });
        } catch (error: any) {
            console.error('Error sending support message:', error);
            setSubmitStatus({
                type: 'error',
                text: error.message || 'Impossible d\'envoyer le message. Veuillez réessayer plus tard.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Support & Aide</h1>
                <p className="text-gray-600 mt-1">Trouvez des réponses à vos questions ou contactez notre équipe</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* FAQ Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <HelpCircle className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Questions Fréquentes</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                    >
                                        <span className="font-medium text-gray-900">{faq.question}</span>
                                        {openFaqIndex === index ? (
                                            <ChevronUp className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                    {openFaqIndex === index && (
                                        <div className="p-4 bg-white text-gray-600 border-t border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <Mail className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Contactez-nous</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {submitStatus && (
                                <div className={`p-4 rounded-lg flex items-center space-x-3 ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {submitStatus.type === 'success' ? (
                                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                    )}
                                    <span>{submitStatus.text}</span>
                                </div>
                            )}

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Sujet de votre demande
                                </label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                        placeholder="Ex: Problème de facturation, Question technique..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Votre message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                                    placeholder="Décrivez votre problème ou votre question en détail..."
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Envoi en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            <span>Envoyer le message</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Vous préférez un rendez-vous téléphonique ?</p>
                                <a
                                    href="https://calendly.com/zenty-support"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                                >
                                    Planifier un rendez-vous
                                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;

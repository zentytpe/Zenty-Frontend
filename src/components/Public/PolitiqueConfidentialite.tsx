import React from 'react';
import PublicHeader from '../Layout/PublicHeader';
import PublicFooter from '../Layout/PublicFooter';
import { Shield, Lock, Eye, UserCheck, Scale } from 'lucide-react';

const PolitiqueConfidentialite: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PublicHeader />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Politique de confidentialité & protection des données (RGPD)</h1>
                    <p className="text-gray-500 mb-8">Dernière mise à jour : 13/12/2025</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            1. Responsable du traitement
                        </h2>
                        <p className="text-gray-600 mb-2">Les données personnelles collectées via le site et les services Zenty sont traitées par :</p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="font-semibold text-gray-900">ZENTY</p>
                            <p className="text-gray-600">SAS – RCS Lille Métropole 979 007 101</p>
                            <p className="text-gray-600">Siège social : 165 avenue de Bretagne, 59000 Lille, France</p>
                            <p className="text-gray-600">📧 Email : contact@zenty.fr</p>
                        </div>
                        <p className="text-gray-600 mt-2">Zenty agit en qualité de responsable de traitement au sens du Règlement (UE) 2016/679 (RGPD).</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            2. Données collectées
                        </h2>
                        <p className="text-gray-600 mb-4">Dans le cadre de l’utilisation des services Zenty, les données suivantes peuvent être collectées :</p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">2.1 Données d’identification</h3>
                                <ul className="list-disc list-inside text-gray-600 ml-2">
                                    <li>Nom, prénom</li>
                                    <li>Adresse email</li>
                                    <li>Numéro de téléphone (le cas échéant)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">2.2 Données biométriques</h3>
                                <p className="text-gray-600 mb-2">Gabarit biométrique chiffré de la paume de la main</p>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                    <p className="font-semibold text-yellow-800">⚠️ Important :</p>
                                    <p className="text-yellow-700">Zenty ne stocke jamais d’image de la paume.<br />Seul un modèle biométrique irréversible, inutilisable hors du système Zenty, est conservé.</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">2.3 Données de paiement</h3>
                                <ul className="list-disc list-inside text-gray-600 ml-2">
                                    <li>Identifiant de paiement</li>
                                    <li>Historique des transactions</li>
                                </ul>
                                <p className="text-gray-600 mt-2">
                                    <span className="font-semibold text-blue-600">👉 </span>
                                    Les données bancaires complètes (numéro de carte, cryptogramme, etc.) ne sont jamais stockées par Zenty.
                                    Elles sont traitées exclusivement le prestataire de paiement certifié PCI-DSS.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">2.4 Données techniques</h3>
                                <ul className="list-disc list-inside text-gray-600 ml-2">
                                    <li>Adresse IP</li>
                                    <li>Type de navigateur et appareil</li>
                                    <li>Journaux de connexion et de sécurité</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">3. Finalités du traitement</h2>
                        <p className="text-gray-600 mb-2">Les données collectées sont utilisées pour :</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                            <li>Création et gestion des comptes utilisateurs</li>
                            <li>Authentification biométrique lors des paiements</li>
                            <li>Exécution et sécurisation des transactions</li>
                            <li>Prévention de la fraude</li>
                            <li>Support client et assistance</li>
                            <li>Respect des obligations légales et réglementaires</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <Scale className="h-5 w-5 text-blue-600" />
                            4. Base légale des traitements
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                            <li>L’exécution d’un contrat (utilisation des services Zenty)</li>
                            <li>Le consentement explicite de l’utilisateur (biométrie)</li>
                            <li>Les obligations légales applicables aux services de paiement</li>
                            <li>L’intérêt légitime de Zenty (sécurité et prévention de la fraude)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Données biométriques – consentement explicite</h2>
                        <p className="text-gray-600 mb-2">L’utilisation de la biométrie repose sur le consentement libre, spécifique, éclairé et explicite de l’utilisateur.</p>
                        <p className="text-gray-600 mb-2">L’utilisateur peut :</p>
                        <ul className="list-disc list-inside text-gray-600 mb-2 ml-2">
                            <li>Refuser l’utilisation de la biométrie</li>
                            <li>Retirer son consentement à tout moment</li>
                        </ul>
                        <p className="text-blue-600 font-medium">👉 Le retrait du consentement entraîne la désactivation du paiement par paume.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">6. Destinataires des données</h2>
                        <p className="text-gray-600 mb-2">Les données personnelles peuvent être transmises uniquement à :</p>
                        <ul className="list-disc list-inside text-gray-600 mb-2 ml-2">
                            <li>Les équipes internes Zenty habilitées</li>
                            <li>Les prestataires techniques nécessaires au fonctionnement du service</li>
                            <li>Prestataire de paiement (paiement)</li>
                            <li>Les autorités compétentes, sur obligation légale</li>
                        </ul>
                        <p className="text-gray-600 font-medium">Aucune donnée n’est vendue ou cédée à des tiers.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Transfert hors Union Européenne</h2>
                        <p className="text-gray-600 mb-2">Certains prestataires techniques peuvent être situés hors de l’Union Européenne.</p>
                        <p className="text-gray-600 mb-2">Dans ce cas, Zenty s’assure que :</p>
                        <ul className="list-disc list-inside text-gray-600 ml-2">
                            <li>des garanties appropriées sont mises en place (clauses contractuelles types),</li>
                            <li>le niveau de protection est conforme aux exigences du RGPD.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">8. Durée de conservation</h2>
                        <p className="text-gray-600 mb-2">Les données sont conservées :</p>
                        <ul className="list-disc list-inside text-gray-600 ml-2">
                            <li><span className="font-semibold">Données de compte :</span> tant que le compte est actif</li>
                            <li><span className="font-semibold">Données biométriques :</span> jusqu’à suppression du compte ou retrait du consentement</li>
                            <li><span className="font-semibold">Données de transaction :</span> conformément aux obligations légales</li>
                            <li><span className="font-semibold">Données techniques :</span> durée strictement nécessaire à la sécurité</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <Lock className="h-5 w-5 text-blue-600" />
                            9. Sécurité des données
                        </h2>
                        <p className="text-gray-600 mb-2">Zenty met en œuvre des mesures techniques et organisationnelles renforcées :</p>
                        <ul className="list-disc list-inside text-gray-600 ml-2">
                            <li>Chiffrement des données</li>
                            <li>Accès restreint et contrôlé</li>
                            <li>Journalisation des accès</li>
                            <li>Hébergement sécurisé</li>
                            <li>Audits et mises à jour régulières</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-blue-600" />
                            10. Droits des utilisateurs
                        </h2>
                        <p className="text-gray-600 mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                            <ul className="list-disc list-inside text-gray-600 ml-2">
                                <li>Droit d’accès</li>
                                <li>Droit de rectification</li>
                                <li>Droit à l’effacement</li>
                                <li>Droit à la limitation du traitement</li>
                            </ul>
                            <ul className="list-disc list-inside text-gray-600 ml-2">
                                <li>Droit d’opposition</li>
                                <li>Droit à la portabilité</li>
                                <li>Droit de retrait du consentement à tout moment</li>
                            </ul>
                        </div>
                        <p className="text-gray-600">📩 Pour exercer vos droits : contact@zenty.fr</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">11. Réclamation auprès de la CNIL</h2>
                        <p className="text-gray-600 mb-2">Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de :</p>
                        <p className="text-gray-600">CNIL – Commission Nationale de l’Informatique et des Libertés</p>
                        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.cnil.fr</a>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">12. Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Le site Zenty peut utiliser des cookies strictement nécessaires au fonctionnement du service et à l’analyse de performance.
                            <br />
                            Les modalités détaillées sont précisées dans la politique de cookies accessible sur le site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">13. Modification de la politique</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Zenty se réserve le droit de modifier la présente politique à tout moment.
                            <br />
                            Les utilisateurs seront informés de toute modification substantielle.
                        </p>
                    </section>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
};

export default PolitiqueConfidentialite;

import React from 'react';
import PublicHeader from '../Layout/PublicHeader';
import PublicFooter from '../Layout/PublicFooter';
import { Shield, CreditCard, UserPlus, FileText, Store, Globe } from 'lucide-react';

const FAQ: React.FC = () => {
    const sections = [
        {
            title: "Sécurité & confidentialité",
            icon: Shield,
            questions: [
                {
                    q: "Est-ce que payer avec la paume de la main est vraiment sécurisé ?",
                    a: (
                        <>
                            Oui. Zenty utilise une technologie biométrique avancée basée sur les caractéristiques internes de la paume (structure sous-cutanée).<br />
                            👉 Impossible à copier, à photographier ou à reproduire.
                        </>
                    )
                },
                {
                    q: "Peut-on utiliser une photo de ma main pour payer ?",
                    a: (
                        <>
                            ❌ Non.<br />
                            Le système ne reconnaît pas une image. Il analyse des données biométriques internes impossibles à capter avec une photo, une vidéo ou un écran.
                        </>
                    )
                },
                {
                    q: "Peut-on frauder avec un moulage ou une fausse main ?",
                    a: (
                        <>
                            ❌ Non.<br />
                            Le capteur détecte uniquement une main vivante, avec des caractéristiques physiologiques réelles.<br />
                            Aucun objet ou reproduction ne peut fonctionner.
                        </>
                    )
                },
                {
                    q: "Est-ce que Zenty stocke l’image de ma main ?",
                    a: (
                        <>
                            Non.<br />
                            Zenty ne stocke aucune image de votre paume.<br />
                            Seul un gabarit biométrique chiffré et inutilisable hors du système Zenty est conservé.
                        </>
                    )
                },
                {
                    q: "Mes données sont-elles revendues ou partagées ?",
                    a: (
                        <>
                            ❌ Jamais.<br />
                            Vos données sont strictement confidentielles, hébergées de manière sécurisée et conformes au RGPD.
                        </>
                    )
                }
            ]
        },
        {
            title: "Paiement & fonctionnement",
            icon: CreditCard,
            questions: [
                {
                    q: "Comment fonctionne le paiement avec Zenty ?",
                    a: (
                        <>
                            Le commerçant saisit le montant<br />
                            Vous approchez votre paume au-dessus du capteur<br />
                            Le paiement est validé en quelques secondes<br />
                            👉 Pas de carte, pas de téléphone, pas de code
                        </>
                    )
                },
                {
                    q: "Dois-je poser ma main sur le capteur ?",
                    a: (
                        <>
                            Non.<br />
                            👉 La main survole simplement le capteur, sans contact.<br />
                            C’est hygiénique et rapide.
                        </>
                    )
                },
                {
                    q: "Combien de temps dure un paiement ?",
                    a: "⏱️ En moyenne moins de 10 secondes."
                },
                {
                    q: "Faut-il une connexion internet ?",
                    a: (
                        <>
                            Oui, comme tout paiement électronique.<br />
                            La connexion est sécurisée et chiffrée.
                        </>
                    )
                },
                {
                    q: "Puis-je payer partout avec Zenty ?",
                    a: "Vous pouvez payer chez tous les commerçants équipés d’un terminal Zenty."
                }
            ]
        },
        {
            title: "Inscription & compte client",
            icon: UserPlus,
            questions: [
                {
                    q: "Comment s’inscrire à Zenty ?",
                    a: (
                        <>
                            L’inscription se fait une seule fois :<br />
                            En ligne ou en point partenaire<br />
                            Vous enregistrez votre paume<br />
                            Vous ajoutez votre carte bancaire sécurisée<br />
                            Ensuite, vous n’avez plus rien à faire.
                        </>
                    )
                },
                {
                    q: "Dois-je installer une application ?",
                    a: (
                        <>
                            Non.<br />
                            👉 Aucune application à ouvrir pour payer.
                        </>
                    )
                },
                {
                    q: "Puis-je associer plusieurs cartes bancaires ?",
                    a: "Oui, depuis votre espace Zenty sécurisé."
                },
                {
                    q: "Puis-je supprimer mon compte ?",
                    a: (
                        <>
                            Oui, à tout moment.<br />
                            Vos données biométriques et bancaires sont alors définitivement supprimées.
                        </>
                    )
                }
            ]
        },
        {
            title: "Suivi & contrôle",
            icon: FileText,
            questions: [
                {
                    q: "Puis-je suivre mes paiements ?",
                    a: (
                        <>
                            Oui.<br />
                            Vous pouvez consulter votre historique de paiements depuis votre espace personnel.
                        </>
                    )
                },
                {
                    q: "Que se passe-t-il en cas de problème ou de litige ?",
                    a: "Comme pour un paiement classique par carte vous bénéficiez des mêmes protections"
                }
            ]
        },
        {
            title: "Côté commerçant",
            icon: Store,
            questions: [
                {
                    q: "Le commerçant voit-il mes données ?",
                    a: (
                        <>
                            Non.<br />
                            Le commerçant ne voit que la confirmation du paiement, jamais vos données personnelles.
                        </>
                    )
                },
                {
                    q: "Zenty remplace-t-il le TPE classique ?",
                    a: "Zenty est une solution de paiement complémentaire, rapide et innovante, intégrable en caisse."
                },
                {
                    q: "Le ticket de caisse est-il généré normalement ?",
                    a: (
                        <>
                            Oui.<br />
                            Le paiement Zenty s’intègre au parcours classique de caisse.
                        </>
                    )
                }
            ]
        },
        {
            title: "Général",
            icon: Globe,
            questions: [
                {
                    q: "Zenty est-il conforme aux normes européennes ?",
                    a: (
                        <>
                            Oui.<br />
                            Zenty respecte :<br />
                            Le RGPD<br />
                            Les normes de sécurité bancaire<br />
                            Les standards de paiement en vigueur
                        </>
                    )
                },
                {
                    q: "Pourquoi choisir Zenty ?",
                    a: (
                        <>
                            ✔ Ultra rapide<br />
                            ✔ Ultra sécurisé<br />
                            ✔ Sans contact<br />
                            ✔ Sans carte<br />
                            ✔ Sans téléphone<br />
                            ✔ Impossible à copier
                        </>
                    )
                },
                {
                    q: "Qui peut utiliser Zenty ?",
                    a: (
                        <>
                            Toute personne majeure disposant :<br />
                            D’un compte Zenty<br />
                            D’une carte bancaire valide
                        </>
                    )
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <PublicHeader />

            {/* Hero FAQ */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">FAQ Zenty</h1>
                    <p className="text-xl text-gray-600">
                        Le paiement par paume de main, simple et sécurisé
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-16">
                    {sections.map((section, idx) => (
                        <div key={idx}>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <section.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                            </div>

                            <div className="space-y-8 pl-0 md:pl-12">
                                {section.questions.map((item, qIdx) => (
                                    <div key={qIdx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {item.q}
                                        </h3>
                                        <div className="text-gray-600 leading-relaxed">
                                            {item.a}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default FAQ;

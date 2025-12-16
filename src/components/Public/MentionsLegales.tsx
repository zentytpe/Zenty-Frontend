import React from 'react';
import PublicHeader from '../Layout/PublicHeader';
import PublicFooter from '../Layout/PublicFooter';

const MentionsLegales: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PublicHeader />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold mb-8 text-gray-900">MENTIONS LÉGALES</h1>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Éditeur du site</h2>
                        <p className="text-gray-600 mb-2">Le présent site est édité par la société :</p>
                        <p className="font-semibold text-gray-900">ZENTY</p>
                        <p className="text-gray-600">Société par actions simplifiée (SAS)</p>
                        <p className="text-gray-600">Siège social : 165 avenue de Bretagne, 59000 Lille, France</p>
                        <p className="text-gray-600">Immatriculée au Registre du Commerce et des Sociétés de Lille Métropole sous le numéro 979 007 101</p>
                        <p className="text-gray-600">📧 Email : contact@zenty.fr</p>
                        <p className="text-gray-600">Directeur de la publication : Président de la société ZENTY.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Hébergement</h2>
                        <p className="text-gray-600 mb-2">Le site est hébergé par :</p>
                        <p className="font-semibold text-gray-900">Vercel Inc.</p>
                        <p className="text-gray-600">340 S Lemon Ave #4133</p>
                        <p className="text-gray-600">Walnut, CA 91789</p>
                        <p className="text-gray-600">États-Unis</p>
                        <p className="text-gray-600">🌐 Site : vercel.com</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Objet du site</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Le site Zenty a pour objet de présenter une solution de paiement innovante permettant aux utilisateurs de régler leurs achats auprès de commerçants partenaires grâce à une technologie biométrique basée sur la reconnaissance de la paume de la main.
                            <br />
                            Zenty agit en qualité de fournisseur de solution technologique et ne réalise pas directement d’opérations bancaires.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Accès au service</h2>
                        <p className="text-gray-600 leading-relaxed">
                            L’accès au site est libre et gratuit.
                            <br />
                            L’utilisation de certaines fonctionnalités (création de compte, paiement, services associés) est réservée aux utilisateurs disposant d’un compte Zenty actif et acceptant les conditions générales d’utilisation.
                            <br />
                            Zenty se réserve le droit de suspendre ou de modifier l’accès au site à tout moment, notamment pour des raisons techniques, de maintenance ou de sécurité.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Propriété intellectuelle</h2>
                        <p className="text-gray-600 leading-relaxed">
                            L’ensemble du site, incluant notamment les textes, images, logos, graphismes, vidéos, icônes, sons, logiciels et bases de données, est la propriété exclusive de Zenty, sauf mention contraire.
                            <br />
                            Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, du contenu du site, par quelque procédé que ce soit, est interdite sans l’autorisation écrite préalable de Zenty.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Responsabilité</h2>
                        <p className="text-gray-600 mb-2">Zenty met tout en œuvre pour fournir des informations fiables et à jour. Toutefois, la société ne saurait être tenue responsable :</p>
                        <ul className="list-disc list-inside text-gray-600 ml-4">
                            <li>des erreurs ou omissions présentes sur le site,</li>
                            <li>d’une indisponibilité temporaire du service,</li>
                            <li>de dommages directs ou indirects résultant de l’utilisation du site.</li>
                        </ul>
                        <p className="text-gray-600 mt-2">L’utilisateur est seul responsable de l’usage qu’il fait des informations et services proposés.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Données personnelles</h2>
                        <p className="text-gray-600 mb-2">Zenty attache une importance particulière à la protection des données personnelles de ses utilisateurs.</p>
                        <p className="text-gray-600 mb-2">Les traitements de données sont réalisés conformément :</p>
                        <ul className="list-disc list-inside text-gray-600 ml-4">
                            <li>au Règlement Général sur la Protection des Données (RGPD),</li>
                            <li>à la loi « Informatique et Libertés ».</li>
                        </ul>
                        <p className="text-gray-600 mt-2">Les modalités de collecte, de traitement, de conservation et de suppression des données personnelles sont détaillées dans la Politique de confidentialité accessible sur le site.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Le site peut utiliser des cookies ou traceurs afin d’améliorer l’expérience utilisateur, mesurer l’audience et assurer le bon fonctionnement des services.
                            <br />
                            L’utilisateur peut à tout moment configurer ou refuser les cookies via les paramètres de son navigateur ou le bandeau de consentement affiché lors de la première visite.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Droit applicable</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Les présentes mentions légales sont soumises au droit français.
                            <br />
                            En cas de litige, et à défaut de résolution amiable, les tribunaux compétents seront ceux du ressort du siège social de Zenty.
                        </p>
                    </section>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
};

export default MentionsLegales;

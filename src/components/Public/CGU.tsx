import React from 'react';
import PublicHeader from '../Layout/PublicHeader';
import PublicFooter from '../Layout/PublicFooter';

const CGU: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PublicHeader />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold mb-8 text-gray-900">CONDITIONS GÉNÉRALES D'UTILISATION (CGU)</h1>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Objet</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions dans lesquelles la société ZENTY met à disposition de ses utilisateurs le site et les services disponibles.
                            <br />
                            Toute utilisation du site implique l'acceptation pleine et entière des présentes CGU.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Accès aux services</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Le service est accessible gratuitement à tout utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès au service, que ce soient les frais matériels, logiciels ou d'accès à internet sont exclusivement à la charge de l'utilisateur.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">3. Inscription et compte utilisateur</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Pour accéder à certaines fonctionnalités, l'utilisateur doit créer un compte. Il s'engage à fournir des informations sincères et exactes. L'utilisateur est responsable de la confidentialité de ses identifiants de connexion.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Données personnelles</h2>
                        <p className="text-gray-600 leading-relaxed">
                            ZENTY s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site, soient conformes au règlement général sur la protection des données (RGPD). Pour plus d'informations, référez-vous à notre Politique de confidentialité.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Propriété intellectuelle</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Tous les éléments du site (textes, images, logos, etc.) sont protégés par le droit de la propriété intellectuelle. Toute reproduction est interdite sans autorisation préalable.
                        </p>
                    </section>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
};

export default CGU;

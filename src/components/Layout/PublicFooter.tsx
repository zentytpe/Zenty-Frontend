import React from 'react';
import { Link } from 'react-router-dom';
import { Hand } from 'lucide-react';

const PublicFooter: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Hand className="h-6 w-6" />
                            <span className="text-xl font-bold">Zenty</span>
                        </div>
                        <p className="text-gray-400">
                            La révolution du paiement biométrique pour tous.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Produit</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/demander-boitier" className="hover:text-white">Demander mon boîtier</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Entreprise</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/cgu" className="hover:text-white">Conditions Générales d'Utilisation</Link></li>
                            <li><Link to="/mentions-legales" className="hover:text-white">Mentions Légales</Link></li>
                            <li><Link to="/politique-confidentialite" className="hover:text-white">Politique de confidentialité</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Zenty. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;

import React, { useState, useEffect } from 'react';
import { Hand, MapPin, Calendar, Shield, QrCode, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PalmStatus {
  palmRegistered: boolean;
  verified: boolean;
  registrationDate?: string;
  registrationLocation?: {
    merchantName: string;
    address: string;
    terminalName: string;
  };
}

interface Merchant {
  _id: string;
  companyName: string;
  address: string;
  email: string;
  phone: string;
}

const PalmManagement: React.FC = () => {
  const { user } = useAuth();
  const [palmStatus, setPalmStatus] = useState<PalmStatus | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [showEnrollmentLocations, setShowEnrollmentLocations] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL_PROD || 'http://localhost:3000';

  useEffect(() => {
    const fetchPalmData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('zenty_token');

        // Fetch palm status
        const palmRes = await fetch(`${API_URL}/api/v1/users/${user._id}/palm/status`, {
          headers: { 'x-auth-token': token || '' }
        });

        if (palmRes.ok) {
          const palmData = await palmRes.json();
          setPalmStatus(palmData);
        }

        // Fetch merchants list
        const merchantsRes = await fetch(`${API_URL}/api/v1/merchants/list`);
        if (merchantsRes.ok) {
          const merchantsData = await merchantsRes.json();
          setMerchants(merchantsData.merchants);
        }
      } catch (err) {
        console.error('Error fetching palm data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPalmData();
  }, [user, API_URL]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center space-x-3">
        <Hand className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ma paume</h1>
          <p className="text-gray-600">Gérez votre empreinte biométrique</p>
        </div>
      </div>

      {/* Palm Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Statut de votre paume</h2>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${palmStatus?.palmRegistered
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
            }`}>
            {palmStatus?.palmRegistered ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="font-medium">
              {palmStatus?.palmRegistered ? 'Enregistrée ✅' : 'Non enregistrée ❌'}
            </span>
          </div>
        </div>

        {palmStatus?.palmRegistered ? (
          <div className="space-y-4">
            {palmStatus.registrationDate && (
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Enregistrée le {formatDate(palmStatus.registrationDate)}</span>
              </div>
            )}
            {palmStatus.registrationLocation && (
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>Chez {palmStatus.registrationLocation.merchantName}, {palmStatus.registrationLocation.address}</span>
              </div>
            )}
            <div className="flex items-center space-x-3 text-gray-600">
              <Shield className="h-5 w-5" />
              <span>Pour votre sécurité, votre empreinte biométrique est chiffrée et stockée en toute sécurité.</span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowEnrollmentLocations(!showEnrollmentLocations)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Enregistrer ma paume
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Hand className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">
              Votre paume n'est pas encore enregistrée. Rendez-vous dans un point équipé pour l'enregistrer.
            </p>
            <button
              onClick={() => setShowEnrollmentLocations(!showEnrollmentLocations)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Hand className="h-5 w-5" />
              <span>Enregistrer ma paume</span>
            </button>
          </div>
        )}
      </div>

      {/* Enrollment Locations */}
      {showEnrollmentLocations && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Points d'enregistrement disponibles</h2>
          {merchants.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun point d'enregistrement disponible pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {merchants.map((merchant) => (
                <div key={merchant._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{merchant.companyName}</p>
                      <p className="text-sm text-gray-500">{merchant.address || 'Adresse non disponible'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{merchant.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QR Code Section - Process explanation remains */}
      {showEnrollmentLocations && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Processus d'enregistrement</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Étapes à suivre :</h3>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                  <span>Rendez-vous dans un point équipé d'un TPE Zenty</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                  <span>Demandez au commerçant d'initier un "Nouvel enregistrement paume"</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">3</span>
                  <span>Scannez le QR code affiché sur le TPE</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">4</span>
                  <span>Autorisez l'enregistrement depuis cette application !</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">5</span>
                  <span>Posez votre main sur le capteur biométrique</span>
                </li>
              </ol>
            </div>
            <div className="text-center">
              <div className="bg-gray-50 p-8 rounded-lg">
                <QrCode className="h-32 w-32 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  QR code d'exemple<br />
                  (Généré par le TPE lors de l'enregistrement)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Information */}
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Sécurité et confidentialité</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Votre empreinte biométrique est immédiatement chiffrée et stockée de manière sécurisée.
              Aucune image de votre paume n'est conservée, seul un modèle mathématique unique est utilisé
              pour la reconnaissance. Vos données biométriques ne peuvent pas être reproduites ou utilisées
              à d'autres fins que l'authentification Zenty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PalmManagement;
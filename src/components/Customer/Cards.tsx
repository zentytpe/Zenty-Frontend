import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface CardInfo {
  id: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

const AddCardForm: React.FC<{ onAdded: () => void; onCancel: () => void }> = ({ onAdded, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: user.email,
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || undefined,
        },
      });

      if (pmError || !paymentMethod) {
        throw new Error(pmError?.message || 'Failed to create payment method');
      }

      // Send to backend
      const token = localStorage.getItem('zenty_token');
      const API_URL = import.meta.env.VITE_BACKEND_URL_PROD || 'http://localhost:3000';

      const res = await fetch(`${API_URL}/api/v1/users/${user._id}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || '',
        },
        body: JSON.stringify({ card_token: paymentMethod.id, make_default: true }),
      });

      if (!res.ok) {
        const { msg } = await res.json().catch(() => ({ msg: 'Server error' }));
        throw new Error(msg);
      }

      onAdded();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={!stripe || isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Ajout…' : 'Ajouter la carte'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

const CardsPage: React.FC = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const token = localStorage.getItem('zenty_token');
  const API_URL = import.meta.env.VITE_BACKEND_URL_PROD || 'http://localhost:3000';

  const fetchCards = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/users/${user._id}/cards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || '',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch cards');
      const data = await res.json();
      setCards(data.cards);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCards();
  }, []);

  const brandIcon = (brand: string) => {
    // Basic mapping; you could refine with logos
    return <CreditCard className="h-6 w-6 text-blue-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mes cartes</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter une carte</span>
        </button>
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : cards.length === 0 ? (
        <p className="text-gray-600">Aucune carte enregistrée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {brandIcon(card.brand)}
                <div>
                  <p className="font-medium text-gray-900">•••• {card.last4}</p>
                  <p className="text-sm text-gray-500">Expire {card.exp_month}/{card.exp_year}</p>
                </div>
              </div>
              {card.is_default && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Par défaut</span>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Ajouter une carte</h2>
            <Elements stripe={stripePromise}>
              <AddCardForm
                onAdded={() => {
                  setShowAdd(false);
                  void fetchCards();
                }}
                onCancel={() => setShowAdd(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsPage; 
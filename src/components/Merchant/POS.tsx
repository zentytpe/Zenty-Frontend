import React, { useState } from 'react';
import { Plus, Minus, Trash2, Hand, CreditCard, ShoppingCart } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  taxRate: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  taxRate: number;
  category: string;
}

const POS: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'palm' | 'card'>('palm');

  const products: Product[] = [
    { id: '1', name: 'Café Expresso', price: 2.50, taxRate: 0.1, category: 'Boissons' },
    { id: '2', name: 'Croissant', price: 1.80, taxRate: 0.1, category: 'Viennoiseries' },
    { id: '3', name: 'Sandwich Jambon', price: 5.50, taxRate: 0.1, category: 'Sandwichs' },
    { id: '4', name: 'Salade César', price: 8.90, taxRate: 0.1, category: 'Salades' },
    { id: '5', name: 'Coca Cola', price: 2.20, taxRate: 0.2, category: 'Boissons' },
    { id: '6', name: 'Pain de mie', price: 3.20, taxRate: 0.055, category: 'Boulangerie' },
    { id: '7', name: 'Muffin Chocolat', price: 3.50, taxRate: 0.1, category: 'Pâtisseries' },
    { id: '8', name: 'Thé Earl Grey', price: 2.80, taxRate: 0.1, category: 'Boissons' }
  ];

  const categories = [...new Set(products.map(p => p.category))];

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity * item.taxRate), 0);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      alert(`Paiement de €${total.toFixed(2)} effectué avec succès par ${paymentMethod === 'palm' ? 'paume' : 'carte'}!`);
      setShowPaymentModal(false);
      clearCart();
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-8">
        <ShoppingCart className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Caisse en ligne</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2 space-y-6">
          {categories.map(category => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.filter(p => p.category === category).map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">€{product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">TVA {(product.taxRate * 100).toFixed(1)}%</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Panier</h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Vider
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Votre panier est vide</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-sm text-gray-500">€{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total HT</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TVA</span>
                    <span>€{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                    <span>Total TTC</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handlePayment}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Hand className="h-5 w-5" />
                    <span>Encaisser par paume</span>
                  </button>
                  <button
                    onClick={handlePayment}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Encaisser par carte</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Paiement en cours
            </h3>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">€{total.toFixed(2)}</div>
              <p className="text-gray-600">
                {paymentMethod === 'palm' ? 'Le client doit poser sa main sur le capteur' : 'Insérez ou présentez la carte'}
              </p>
            </div>
            <div className="flex justify-center mb-6">
              {paymentMethod === 'palm' ? (
                <div className="p-8 bg-blue-50 rounded-full">
                  <Hand className="h-16 w-16 text-blue-600 animate-pulse" />
                </div>
              ) : (
                <div className="p-8 bg-green-50 rounded-full">
                  <CreditCard className="h-16 w-16 text-green-600 animate-pulse" />
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={processPayment}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
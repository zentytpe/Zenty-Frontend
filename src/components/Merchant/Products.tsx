import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface Product {
    _id: string;
    name: string;
    price: number;
    tva: number;
    category: string;
    description?: string;
}

const Products: React.FC = () => {
    const { merchant } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        tva: '20',
        category: '',
        description: ''
    });

    // Fetch Products
    const fetchProducts = async () => {
        if (!merchant) return;
        try {
            const token = localStorage.getItem('zenty_token');
            const response = await fetch(`${API_URL}/api/v1/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch products');

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError('Erreur lors du chargement des produits');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [merchant]);

    // Handle Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('zenty_token');
            const url = editingProduct
                ? `${API_URL}/api/v1/products/${editingProduct._id}`
                : `${API_URL}/api/v1/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    tva: parseFloat(formData.tva)
                })
            });

            if (!response.ok) throw new Error('Operation failed');

            await fetchProducts();
            closeModal();
        } catch (err) {
            setError('Erreur lors de l\'enregistrement du produit');
            console.error(err);
        }
    };

    // Delete Product
    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

        try {
            const token = localStorage.getItem('zenty_token');
            const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete product');

            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            setError('Erreur lors de la suppression');
            console.error(err);
        }
    };

    const openModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                tva: product.tva.toString(),
                category: product.category,
                description: product.description || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                tva: '20',
                category: '',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setError(null);
    };

    if (loading) return <div className="p-6">Chargement...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
                    <p className="text-gray-500 mt-1">Gérez votre catalogue de produits</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter un produit
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-900">Nom</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Catégorie</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Prix HT</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">TVA</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Prix TTC</th>
                                <th className="px-6 py-4 font-semibold text-right text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => {
                                const priceTTC = product.price * (1 + product.tva / 100);
                                return (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                            {product.description && (
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {product.category || 'Général'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">€{product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.tva}%</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">€{priceTTC.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openModal(product)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-lg font-medium text-gray-900">Aucun produit</p>
                                        <p className="text-sm">Commencez par ajouter votre premier produit</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Café Crème"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix HT (€)</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">TVA (%)</label>
                                    <select
                                        value={formData.tva}
                                        onChange={(e) => setFormData({ ...formData, tva: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="20">20%</option>
                                        <option value="10">10%</option>
                                        <option value="5.5">5.5%</option>
                                        <option value="2.1">2.1%</option>
                                        <option value="0">0%</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Boissons"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingProduct ? 'Mettre à jour' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;

import React, { useState, useEffect } from 'react';
import { Box, Plus, Trash2, Search, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types';

export default function AdminInventoryView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'rings',
    price: '',
    description: '',
    image: '',
    collection: 'Signature',
    details: ''
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        details: newProduct.details.split(',').map(d => d.trim())
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewProduct({ name: '', category: 'rings', price: '', description: '', image: '', collection: 'Signature', details: '' });
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to add product', err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white font-light flex items-center gap-3">
            <Box className="w-6 h-6 text-antique-gold" />
            Global Inventory
          </h2>
          <p className="text-sm text-gray-400 mt-1">Manage storefront catalogue and active jewels.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-antique-gold/50 transition-colors"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-antique-gold text-obsidian px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-display tracking-widest uppercase text-gray-500 border-b border-white/10 bg-white/5">
                <th className="p-4 font-medium">Item</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Collection</th>
                <th className="p-4 font-medium text-right">Price</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-antique-gold" />
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 font-serif italic">
                    No products found in the vault.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded overflow-hidden flex-shrink-0 border border-white/10">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon className="w-5 h-5"/></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white/10 text-gray-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{product.collection}</td>
                    <td className="p-4 text-right font-medium text-white">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-serif text-xl text-white">Add to Inventory</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="add-product-form" onSubmit={handleAddProduct} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-display tracking-widest uppercase text-gray-400">Product Name</label>
                    <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-antique-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-display tracking-widest uppercase text-gray-400">Price (₹)</label>
                    <input required type="number" min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-antique-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-display tracking-widest uppercase text-gray-400">Category</label>
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-antique-gold/50 appearance-none">
                      <option value="rings">Rings</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="earrings">Earrings</option>
                      <option value="bracelets">Bracelets</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-display tracking-widest uppercase text-gray-400">Collection</label>
                    <input required type="text" value={newProduct.collection} onChange={e => setNewProduct({...newProduct, collection: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-antique-gold/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-display tracking-widest uppercase text-gray-400">Image URL</label>
                  <input required type="url" placeholder="https://..." value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-antique-gold/50" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-display tracking-widest uppercase text-gray-400">Details (comma separated)</label>
                  <input required type="text" placeholder="GIA Certified, 18k White Gold, VS1 Clarity" value={newProduct.details} onChange={e => setNewProduct({...newProduct, details: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-antique-gold/50" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-display tracking-widest uppercase text-gray-400">Description</label>
                  <textarea required rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-antique-gold/50 resize-none"></textarea>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
              <button type="submit" form="add-product-form" className="px-5 py-2.5 bg-antique-gold text-obsidian text-sm font-medium rounded hover:bg-white transition-colors">Add to Vault</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

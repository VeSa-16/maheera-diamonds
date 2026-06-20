import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Search, X, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types';

interface CatalogueViewProps {
  theme: 'dark' | 'light';
}

export default function CatalogueView({ theme }: CatalogueViewProps) {
  const isDark = theme === 'dark';
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'rings',
    price: 0,
    description: '',
    longDescription: '',
    image: '',
    carat: 0,
    metal: '',
    isBestSeller: false,
    collection: '',
  });
  const [detailsText, setDetailsText] = useState('');
  const [galleryText, setGalleryText] = useState('');

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  // Create product mutation
  const createProduct = useMutation({
    mutationFn: async (newProduct: Partial<Product>) => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('Failed to create product');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // also invalidate storefront
      setIsModalOpen(false);
      resetForm();
    },
  });

  // Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: async ({ id, product }: { id: string, product: Partial<Product> }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to update product');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // also invalidate storefront
      setIsModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'rings',
      price: 0,
      description: '',
      longDescription: '',
      image: '',
      carat: 0,
      metal: '',
      isBestSeller: false,
      collection: '',
    });
    setDetailsText('');
    setGalleryText('');
    setEditProductId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const detailsArray = detailsText.split('\n').filter((d) => d.trim() !== '');
    const galleryArray = galleryText.split('\n').filter((g) => g.trim() !== '');

    const payload: Partial<Product> = {
      ...formData,
      price: Number(formData.price),
      carat: Number(formData.carat),
      details: detailsArray,
      galleryImages: galleryArray,
    };

    if (editProductId) {
      updateProduct.mutate({ id: editProductId, product: payload });
    } else {
      createProduct.mutate(payload);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in relative h-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className={`text-2xl font-serif font-light ${isDark ? 'text-white' : 'text-obsidian'}`}>Salon Inventory</h2>
          <p className={`text-xs font-display tracking-widest uppercase mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage your curated collections
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`px-6 py-3 font-display text-xs tracking-widest uppercase flex items-center gap-2 transition-colors ${
            isDark ? 'bg-antique-gold text-obsidian hover:bg-[#b59659]' : 'bg-obsidian text-white hover:bg-obsidian/90'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Jewelry Piece
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 text-sm border focus:outline-none focus:border-antique-gold transition-colors ${
              isDark
                ? 'bg-obsidian/50 border-white/10 text-white placeholder-gray-600'
                : 'bg-white border-black/10 text-obsidian placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className={`border rounded-sm overflow-hidden ${isDark ? 'border-white/10' : 'border-black/10 bg-white'}`}>
        {isLoading ? (
          <div className="p-12 text-center text-sm font-serif italic text-gray-500">Loading vault...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className={`text-[10px] uppercase tracking-widest font-display border-b ${
              isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-black/10 text-gray-500'
            }`}>
              <tr>
                <th className="px-6 py-4 font-medium">Jewelry Piece</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price (INR)</th>
                <th className="px-6 py-4 font-medium">Specs</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => (
                <tr key={p.id} className={`transition-colors ${isDark ? 'hover:bg-white/5 divide-white/10' : 'hover:bg-gray-50 divide-black/10'}`}>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className={`w-12 h-12 overflow-hidden flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                      )}
                    </div>
                    <div>
                      <p className={`font-serif text-base ${isDark ? 'text-white' : 'text-obsidian'}`}>{p.name}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{p.id}</p>
                    </div>
                  </td>
                  <td className={`px-6 py-4 uppercase text-[10px] tracking-widest ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {p.category}
                  </td>
                  <td className={`px-6 py-4 font-display ${isDark ? 'text-antique-gold' : 'text-obsidian'}`}>
                    ₹{p.price.toLocaleString('en-IN')}
                  </td>
                  <td className={`px-6 py-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {p.carat}ct • {p.metal}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => {
                        setFormData({
                          name: p.name,
                          category: p.category,
                          price: p.price,
                          description: p.description,
                          longDescription: p.longDescription || '',
                          image: p.image,
                          carat: p.carat || 0,
                          metal: p.metal || '',
                          isBestSeller: p.isBestSeller || false,
                          collection: p.collection || '',
                        });
                        setDetailsText(p.details.join('\n'));
                        setGalleryText(p.galleryImages ? p.galleryImages.join('\n') : '');
                        setEditProductId(p.id);
                        setIsModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-antique-gold transition-colors"
                      title="Edit Creation"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
                          deleteProduct.mutate(p.id);
                        }
                      }}
                      className="text-red-500/70 hover:text-red-500 transition-colors"
                      title="Delete Jewelry Piece"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm font-serif italic text-gray-500">
                    No creations found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm">
          <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl p-8 relative border ${
            isDark ? 'bg-[#111] border-white/10' : 'bg-white border-champagne'
          }`}>
            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-antique-gold"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className={`font-serif text-2xl mb-6 ${isDark ? 'text-white' : 'text-obsidian'}`}>
              {editProductId ? 'Edit Jewelry Piece' : 'Add New Jewelry Piece'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Category</label>
                  <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                      isDark ? 'bg-[#222] border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                    }`}
                  >
                    <option value="rings">Rings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Price (INR)</label>
                  <input required type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Carat</label>
                  <input required type="number" step="0.01" min="0" value={formData.carat} onChange={(e) => setFormData({ ...formData, carat: Number(e.target.value) })}
                    className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Metal</label>
                  <input required type="text" placeholder="e.g. 18K Rose Gold" value={formData.metal} onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                    className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Primary Image Link</label>
                <input required type="url" placeholder="https://..." value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                  }`}
                />
                <p className="text-[10px] text-gray-500">Paste a web link to an image (e.g. from your website, Unsplash, or Dropbox).</p>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Extra Gallery Images (One link per line)</label>
                <textarea rows={2} value={galleryText} onChange={(e) => setGalleryText(e.target.value)}
                  className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                  }`}
                />
                <p className="text-[10px] text-gray-500">Optional. Paste additional image links here. Press Enter to add multiple links.</p>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Short Description</label>
                <input required type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Long Description</label>
                <textarea required rows={3} value={formData.longDescription} onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] uppercase tracking-widest font-display ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Technical Details & Specifications</label>
                <textarea required rows={4} value={detailsText} onChange={(e) => setDetailsText(e.target.value)}
                  className={`w-full p-3 text-sm border focus:outline-none focus:border-antique-gold ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-obsidian'
                  }`}
                />
                <p className="text-[10px] text-gray-500">List features like weight, diamond cut, or packaging. Press Enter to start a new bullet point.</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isBestSeller" checked={formData.isBestSeller} onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="w-4 h-4 accent-antique-gold"
                />
                <label htmlFor="isBestSeller" className={`text-sm ${isDark ? 'text-white' : 'text-obsidian'}`}>Feature this as a "Best Seller" on the website</label>
              </div>

              <div className="pt-6 flex justify-end gap-4 border-t border-white/10">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className={`px-6 py-3 font-display text-xs uppercase tracking-widest transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-obsidian'
                  }`}
                >
                  Cancel
                </button>
                <button type="submit" disabled={createProduct.isPending || updateProduct.isPending}
                  className={`px-8 py-3 font-display text-xs uppercase tracking-widest transition-colors ${
                    isDark ? 'bg-antique-gold text-obsidian hover:bg-[#b59659]' : 'bg-obsidian text-white hover:bg-obsidian/90'
                  }`}
                >
                  {createProduct.isPending || updateProduct.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

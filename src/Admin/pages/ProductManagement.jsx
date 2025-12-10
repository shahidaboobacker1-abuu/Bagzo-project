import React, { useState, useEffect } from 'react';
import { api } from '../../API/Axios';
import AdminLayout from '../Component/AdminLayout';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state - removed image field
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    rating: '',
    description: '',
    isNew: false,
    isOnSale: false,
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products with better error handling
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/products');
      // Ensure we have an array even if response structure is different
      const productsData = Array.isArray(response.data) ? response.data : [];
      
      // Filter out "store image" products
      const filteredProducts = productsData.filter(product => 
        !product.name.toLowerCase().includes('store image')
      );
      
      setProducts(filteredProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // More specific error messages
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Failed to load products. Server responded with ${error.response.status}`);
        }
      } else if (error.request) {
        // Request was made but no response
        setError('Network error. Please check your connection.');
      } else {
        // Something else happened
        setError('Failed to load products. Please try again.');
      }
      setLoading(false);
    }
  };

  // Open modal for adding new product
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      rating: '',
      description: '',
      isNew: false,
      isOnSale: false,
    });
    setEditingProduct(null);
  };

  // Open modal for editing product
  const openEditModal = (product) => {
    setFormData({
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || '',
      rating: product.rating || '',
      description: product.description || '',
      isNew: product.isNew || false,
      isOnSale: product.isOnSale || false,
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  // Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare product data - removed image field
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        createdAt: editingProduct ? (editingProduct.createdAt || new Date().toISOString()) : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingProduct) {
        // Update existing product
        await api.put(`/products/${editingProduct.id}`, productData);
        setSuccessMessage('Product updated successfully!');
      } else {
        // Add new product
        const newProduct = {
          ...productData,
          id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        await api.post('/products', newProduct);
        setSuccessMessage('Product added successfully!');
      }

      // Refresh products list
      fetchProducts();
      setShowModal(false);
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error saving product:', error);
      
      let errorMsg = 'Failed to save product. Please try again.';
      if (error.response) {
        if (error.response.status === 500) {
          errorMsg = 'Server error. Please try again later.';
        } else {
          errorMsg = `Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
        }
      }
      
      setError(errorMsg);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        setSuccessMessage('Product deleted successfully!');
        fetchProducts();
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        
      } catch (error) {
        console.error('Error deleting product:', error);
        
        let errorMsg = 'Failed to delete product. Please try again.';
        if (error.response) {
          if (error.response.status === 500) {
            errorMsg = 'Server error. Please try again later.';
          }
        }
        
        setError(errorMsg);
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Filter by search term
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by category
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return 0;
      }
    });

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Get product icon based on category
  const getCategoryIcon = (category) => {
    const icons = {
      'Bags': '👜',
      'Handbags': '👝',
      'Backpacks': '🎒',
      'Wallets': '👛',
      'Shoes': '👟',
      'Accessories': '👓',
      'Electronics': '📱',
      'Clothing': '👕',
      'Home': '🏠',
      'Books': '📚',
      'Sports': '⚽',
      'Default': '📦'
    };
    
    if (!category) return icons.Default;
    
    for (const [key, icon] of Object.entries(icons)) {
      if (category.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    return icons.Default;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-[#F8F4E1] flex justify-center items-center">
          <div className="text-[#5A4738] text-lg font-light">Loading products...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F8F4E1] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header with Add Button */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="mb-1">
                  <span className="text-sm font-light tracking-wider uppercase text-[#AF8F6F]">
                    Product Inventory
                  </span>
                </div>
                <h1 className="text-2xl font-light tracking-wide text-[#2C1810]">
                  Manage Your Store's Products
                </h1>
              </div>
              
              {/* Add Product Button */}
              <button
                onClick={openAddModal}
                className="px-6 py-3 rounded-lg text-sm font-light tracking-wide transition-colors duration-200 hover:opacity-80 flex items-center gap-2 bg-[#2C1810] text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Product
              </button>
            </div>

            {/* Success and Error Messages */}
            {successMessage && (
              <div className="bg-[#F8F4E1] border border-[#E0D6C2] px-4 py-3 rounded mb-4 font-light text-[#8B6F47]">
                {successMessage}
              </div>
            )}
            
            {error && (
              <div className="bg-[#F8F4E1] border border-[#E0D6C2] px-4 py-3 rounded mb-4 font-light text-[#AF8F6F]">
                {error}
              </div>
            )}

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Search */}
              <div>
                <label className="block text-sm font-light mb-2 tracking-wide text-[#5A4738]">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors duration-200 font-light placeholder-[#8B7D6B] bg-white border-[#E0D6C2] text-[#2C1810]"
                  />
                  <svg className="absolute right-4 top-3.5 w-5 h-5 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-light mb-2 tracking-wide text-[#5A4738]">Filter by Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors duration-200 font-light bg-white border-[#E0D6C2] text-[#2C1810]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-light mb-2 tracking-wide text-[#5A4738]">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors duration-200 font-light bg-white border-[#E0D6C2] text-[#2C1810]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-xl border overflow-hidden bg-white border-[#E0D6C2]">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#F8F4E1]">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Product
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Category
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Price
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Rating
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0D6C2]">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#F8F4E1] transition-colors duration-200">
                      <td className="px-8 py-6">
                        <div className="flex items-center min-w-0">
                          <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-lg border bg-white border-[#E0D6C2]">
                            <span className="text-xl">
                              {getCategoryIcon(product.category)}
                            </span>
                          </div>
                          <div className="ml-4 min-w-0">
                            <div className="text-sm font-light tracking-wide text-[#2C1810]">
                              {product.name}
                            </div>
                            {product.description && (
                              <div className="text-sm font-light mt-1 truncate max-w-xs text-[#5A4738]">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="px-4 py-2 rounded-full text-sm font-light tracking-wide border bg-[#F8F4E1] border-[#E0D6C2] text-[#AF8F6F]">
                          {product.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="font-light tracking-wide text-[#2C1810]">{formatPrice(product.price)}</div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm font-light mt-1 line-through text-[#5A4738]">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-[#AF8F6F] fill-current' : 'text-[#E0D6C2] fill-current'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-light text-[#5A4738]">
                            {product.rating ? product.rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          {product.isNew && (
                            <span className="px-3 py-1 rounded-full text-xs font-light tracking-wide border bg-[#F8F4E1] border-[#E0D6C2] text-[#AF8F6F]">
                              New
                            </span>
                          )}
                          {product.isOnSale && (
                            <span className="px-3 py-1 rounded-full text-xs font-light tracking-wide border bg-[#F8F4E1] border-[#E0D6C2] text-[#8B6F47]">
                              Sale
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => openEditModal(product)}
                            className="font-light tracking-wide transition-colors duration-200 hover:opacity-80 text-[#AF8F6F]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="font-light tracking-wide transition-colors duration-200 hover:opacity-80 text-[#AF8F6F]"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-20 h-20 mx-auto text-[#E0D6C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-6 text-lg font-light tracking-wide text-[#2C1810]">No products found</h3>
                <p className="mt-2 font-light text-[#5A4738]">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter to find what you\'re looking for.'
                    : 'No products available in inventory.'}
                </p>
                <button
                  onClick={openAddModal}
                  className="mt-4 px-6 py-3 rounded-lg text-sm font-light tracking-wide transition-colors duration-200 hover:opacity-80 flex items-center gap-2 mx-auto bg-[#2C1810] text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Product
                </button>
              </div>
            )}
          </div>

          {/* Product Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border p-6 bg-white border-[#E0D6C2]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light tracking-wide text-[#2C1810]">Total Products</h3>
                <svg className="w-6 h-6 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-2xl font-light tracking-wide text-[#2C1810]">{products.length}</div>
              <p className="text-sm font-light mt-2 text-[#5A4738]">Products in inventory</p>
            </div>

            <div className="rounded-xl border p-6 bg-white border-[#E0D6C2]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light tracking-wide text-[#2C1810]">Categories</h3>
                <svg className="w-6 h-6 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-2xl font-light tracking-wide text-[#2C1810]">{categories.length - 1}</div>
              <p className="text-sm font-light mt-2 text-[#5A4738]">Unique categories</p>
            </div>

            <div className="rounded-xl border p-6 bg-white border-[#E0D6C2]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light tracking-wide text-[#2C1810]">New Products</h3>
                <svg className="w-6 h-6 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-2xl font-light tracking-wide text-[#2C1810]">{products.filter(p => p.isNew).length}</div>
              <p className="text-sm font-light mt-2 text-[#5A4738]">Marked as new arrivals</p>
            </div>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative mx-auto p-5 w-full max-w-2xl my-8">
              <div className="rounded-xl border max-h-[90vh] overflow-hidden flex flex-col bg-white border-[#E0D6C2]">
                <div className="flex justify-between items-center p-6 border-b shrink-0 border-[#E0D6C2]">
                  <h3 className="text-lg font-light tracking-wide text-[#2C1810]">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="transition-colors duration-200 hover:opacity-80 text-[#AF8F6F]"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-light mb-2 tracking-wide text-[#5A4738]">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors duration-200 font-light placeholder-[#8B7D6B] bg-white border-[#E0D6C2] text-[#2C1810]"
                          placeholder="Enter product name"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-light mb-2 tracking-wide text-[#5A4738]">
                          Category *
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors duration-200 font-light placeholder-[#8B7D6B] bg-white border-[#E0D6C2] text-[#2C1810]"
                          placeholder="e.g., Bags, Handbags, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Price */}
                      <div>
                        <label className="block text-sm font-light mb-2 tracking-wide text-[#5A4738]">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors duration-200 font-light placeholder-[#8B7D6B] bg-white border-[#E0D6C2] text-[#2C1810]"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Original Price */}
                      <div>
                        <label className="block text-sm font-light mb-2 tracking-wide text-[#5A4738]">
                          Original Price (₹)
                        </label>
                        <input
                          type="number"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors duration-200 font-light placeholder-[#8B7D6B] bg-white border-[#E0D6C2] text-[#2C1810]"
                          placeholder="Leave empty if not on sale"
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-wide text-[#5A4738]">
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors duration-200 font-light placeholder-[#8B7D6B] bg-white border-[#E0D6C2] text-[#2C1810]"
                        placeholder="4.5"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-wide text-[#5A4738]">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors duration-200 font-light placeholder-[#8B7D6B] bg-white border-[#E0D6C2] text-[#2C1810]"
                        placeholder="Enter product description"
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="flex space-x-8">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="isNew"
                          checked={formData.isNew}
                          onChange={handleInputChange}
                          className="rounded border-[#E0D6C2] focus:ring-[#AF8F6F] text-[#AF8F6F]"
                        />
                        <span className="ml-2 text-sm font-light text-[#5A4738]">Mark as New</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="isOnSale"
                          checked={formData.isOnSale}
                          onChange={handleInputChange}
                          className="rounded border-[#E0D6C2] focus:ring-[#AF8F6F] text-[#AF8F6F]"
                        />
                        <span className="ml-2 text-sm font-light text-[#5A4738]">Mark as On Sale</span>
                      </label>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="mt-8 flex justify-end space-x-4 pt-6 border-t border-[#E0D6C2]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-6 py-3 border rounded-lg text-sm font-light tracking-wide transition-colors duration-200 hover:opacity-80 border-[#E0D6C2] text-[#2C1810] bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg text-sm font-light tracking-wide transition-colors duration-200 hover:opacity-80 bg-[#2C1810] text-white"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;
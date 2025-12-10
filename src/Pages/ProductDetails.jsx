import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../API/Axios';
import { useCart } from '../Context/CartProvider';
import { useWishlist } from '../Context/WishlistProvider';
import { useAuth } from '../Context/AuthProvider';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef(null);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    imagePath = imagePath.trim();
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('src/')) {
      imagePath = imagePath.replace('src/', '');
    }
    
    if (imagePath.startsWith('assets/')) {
      return `/${imagePath}`;
    }
    
    if (imagePath.startsWith('/assets/')) {
      return imagePath;
    }
    
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  const handleImageError = () => {
    console.error('Image failed to load:', product?.image);
    setImageError(true);
  };

  // Format price in Indian currency style
  const formatPrice = (price) => {
    if (typeof price !== 'number') {
      price = parseFloat(price) || 0;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/products');
      const allProducts = response.data;
      
      const foundProduct = allProducts.find(product => {
        return (
          product.id == id || 
          product.id === parseInt(id) ||
          product.product_id == id ||
          product.product_id === parseInt(id)
        );
      });
      
      if (foundProduct) {
        console.log('✅ Found product:', foundProduct);
        setProduct(foundProduct);
        setImageError(false);
      } else {
        console.log('❌ Product not found.');
        setError(`Product with ID "${id}" not found.`);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('🚨 Error fetching products:', error);
      setError('Failed to connect to server. Please check if JSON Server is running on http://localhost:5001');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    console.log(`✅ Added ${quantity} ${product.name} to cart!`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      alert('Please login to add items to your wishlist');
      navigate('/login');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      console.log(`🗑️ Removed ${product.name} from wishlist!`);
    } else {
      addToWishlist(product);
      console.log(`❤️ Added ${product.name} to wishlist!`);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleBackToProducts = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#2C1810] rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-light tracking-wider">LOADING PRODUCT DETAILS</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center">
        <div className="text-center px-8">
          <div className="text-6xl mb-8 text-gray-300">✦</div>
          <h1 className="text-4xl font-light text-[#2C1810] mb-6 tracking-widest">PRODUCT NOT FOUND</h1>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto font-light tracking-wide text-lg">{error}</p>
          <div className="flex gap-6 justify-center">
            <button
              onClick={handleBackToProducts}
              className="bg-[#2C1810] text-white px-10 py-4 rounded-full font-light tracking-widest text-lg hover:bg-gray-800 transition-all duration-300"
            >
              BACK TO COLLECTION
            </button>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-full font-light tracking-widest text-lg hover:border-[#2C1810] hover:text-[#2C1810] transition-all duration-300"
            >
              RETURN HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cartQuantity = getItemQuantity(product.id);
  const isProductInCart = isInCart(product.id);
  const isProductInWishlist = isInWishlist(product.id);
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="min-h-screen bg-[#F8F4E1]">
      {/* Navigation Bar - Same as product page */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F4E1] py-4 border-b border-[#5c4024]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-light tracking-widest text-[#2C1810] hover:text-[#AF8F6F] transition-colors"
            >
              BAGZO
            </button>
            <div className="flex items-center space-x-8">
              <button 
                onClick={handleBackToProducts}
                className="text-sm tracking-wider text-[#2C1810] hover:text-[#AF8F6F] transition-colors font-light"
              >
                COLLECTION
              </button>
              <button 
                onClick={() => navigate('/cart')}
                className="text-sm tracking-wider text-[#2C1810] hover:text-[#AF8F6F] transition-colors font-light"
              >
                CART ({cartQuantity})
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Details - Same color theme */}
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-[#5A4738] font-light tracking-wider">
              <button 
                onClick={() => navigate('/')}
                className="hover:text-[#2C1810] transition-colors"
              >
                HOME
              </button>
              <span className="mx-3">/</span>
              <button 
                onClick={handleBackToProducts}
                className="hover:text-[#2C1810] transition-colors"
              >
                COLLECTION
              </button>
              <span className="mx-3">/</span>
              <span className="text-[#2C1810] truncate max-w-md">
                {product.name.toUpperCase()}
              </span>
            </nav>
          </div>

          {/* Product Card - Image fills card */}
          <div className="bg-white rounded-xl shadow-lg border border-[#E0D6C2] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Section - Full fill */}
              <div className="relative">
                <div className="aspect-square">
                  {!imageError && imageUrl ? (
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8F4E1]">
                      <div className="text-6xl font-light text-gray-300 mb-4">
                        {product.name ? product.name.charAt(0) : 'B'}
                      </div>
                      <p className="text-gray-400 font-light text-lg tracking-wide">
                        {product.name || 'LUXURY BAG'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Product Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.isNew && (
                    <span className="bg-white/90 text-[#2C1810] text-xs px-3 py-1.5 rounded-full font-light tracking-wider shadow">
                      NEW
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-[#2C1810] text-white text-xs px-3 py-1.5 rounded-full font-light tracking-wider shadow">
                      SALE
                    </span>
                  )}
                </div>

                {/* Cart Status */}
                {isProductInCart && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-[#2C1810] text-xs px-3 py-1.5 rounded-full font-light tracking-wider shadow">
                      IN CART: {cartQuantity}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details Section */}
              <div className="p-8">
                <div className="space-y-6">
                  {/* Title Section */}
                  <div>
                    {product.category && (
                      <p className="text-sm text-gray-500 font-light tracking-widest uppercase mb-2">
                        {product.category} COLLECTION
                      </p>
                    )}
                    <h1 className="text-3xl font-light text-[#2C1810] tracking-tight leading-snug">
                      {product.name}
                    </h1>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-3 mt-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating || 5) 
                                ? 'text-[#2C1810] fill-current' 
                                : 'text-gray-300 fill-current'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 font-light">({product.rating || 5.0})</span>
                      <span className="text-sm text-gray-500 font-light">•</span>
                      <span className="text-sm text-gray-500 font-light">12 REVIEWS</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-4">
                      <span className="text-3xl font-light text-[#2C1810]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xl text-gray-400 line-through font-light">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.isOnSale && product.originalPrice && (
                      <p className="text-sm text-gray-600 font-light">
                        Save {formatPrice(product.originalPrice - product.price)}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed font-light tracking-wide">
                      {product.description || "Experience unparalleled luxury with this exquisite piece from our premium collection. Meticulously crafted with the finest materials, each detail reflects our commitment to exceptional quality and timeless elegance."}
                    </p>
                  </div>

                  {/* Quantity Selection */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-light tracking-wider">QUANTITY</span>
                      <div className="flex items-center border border-gray-200 rounded-full bg-white">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-[#2C1810] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={quantity <= 1}
                        >
                          <span className="text-2xl">−</span>
                        </button>
                        <span className="w-12 text-center text-lg font-light text-[#2C1810]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-[#2C1810] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={quantity >= 10}
                        >
                          <span className="text-2xl">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Side by Side */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex gap-4">
                      {/* Cart Button - Main Button */}
                      <button
                        onClick={handleAddToCart}
                        className={`flex-1 py-4 px-6 rounded-full font-light tracking-widest transition-all duration-300 flex items-center justify-center space-x-3 ${
                          isProductInCart
                            ? 'bg-gray-800 text-white hover:bg-gray-900'
                            : 'bg-[#2C1810] text-white hover:bg-gray-800'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                        </svg>
                        <span className="text-sm">
                          {isProductInCart ? `ADD MORE (${cartQuantity})` : 'ADD TO CART'}
                        </span>
                      </button>
                      
                      {/* Wishlist Button - Side Button */}
                      <button
                        onClick={handleWishlistToggle}
                        className={`w-14 h-14 flex items-center justify-center rounded-full border font-light tracking-widest transition-all duration-300 ${
                          isProductInWishlist
                            ? 'border-[#2C1810] text-[#2C1810] bg-white hover:bg-gray-50'
                            : 'border-gray-300 text-gray-700 hover:border-[#2C1810] hover:text-[#2C1810]'
                        }`}
                      >
                        <svg 
                          className={`w-6 h-6 ${isProductInWishlist ? 'fill-[#2C1810]' : 'fill-none'}`} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          strokeWidth={isProductInWishlist ? 0 : 1.5}
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Products */}
          <div className="mt-8 text-center">
            <button
              onClick={handleBackToProducts}
              className="inline-flex items-center space-x-2 text-[#2C1810] hover:text-gray-800 transition-colors group"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-light tracking-widest uppercase">
                BACK TO COLLECTION
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
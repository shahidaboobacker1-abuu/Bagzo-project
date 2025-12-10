import React, { useState, useRef, useEffect } from 'react'
import { api } from '../API/Axios'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../Context/WishlistProvider'
import { useAuth } from '../Context/AuthProvider'
import { useCart } from '../Context/CartProvider'

function Card() {
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products')
        // Filter out store images
        const filteredProducts = response.data.filter(product => 
          !product.name.toLowerCase().includes('store image')
        );
        setProducts(filteredProducts)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

  const checkScrollPosition = () => {
    const container = containerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollRight = () => {
    const container = containerRef.current
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  const scrollLeft = () => {
    const container = containerRef.current
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
  }

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to your wishlist');
      navigate('/login');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  useEffect(() => {
    checkScrollPosition()
    window.addEventListener('resize', checkScrollPosition)
    return () => {
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      setTimeout(checkScrollPosition, 100)
    }
  }, [products])

  if (loading) {
    return (
      <div className="py-24 bg-[#FEFCF5]">
        <div className="max-w-7xl mx-auto px-0">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl font-light text-[#2C1810] mb-4 tracking-wide">FEATURED COLLECTION</h2>
            <p className="text-[#5A4738] text-lg max-w-2xl mx-auto font-light italic">
              Timeless elegance meets modern craftsmanship
            </p>
          </div>
          <div className="flex justify-center items-center h-60">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-4 border-[#E8E1D0] border-t-[#B89B6F] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#5A4738] font-light tracking-wide">Loading our luxury collection...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Luxury Featured Collection */}
      <div className="py-24 bg-[#FEFCF5]">
        <div className="mx-auto px-0">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl md:text-5xl font-light text-[#2C1810] mb-4 tracking-wide">FEATURED COLLECTION</h2>
            <p className="text-[#5A4738] text-lg max-w-2xl mx-auto font-light italic">
              Curated selection of premium craftsmanship and timeless design
            </p>
            <div className="h-px w-32 mx-auto bg-linear-to-r from-transparent via-[#B89B6F] to-transparent mt-6"></div>
          </div>

          {/* Scrollable Container - Full width */}
          <div className="relative w-full">
            <div 
              ref={containerRef}
              className="flex overflow-x-auto gap-10 scroll-smooth pb-12 px-4"
              onScroll={checkScrollPosition}
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
            >
              {products.slice(0, 10).map((product) => (
                <div 
                  key={product.id || product.product_id}
                  className="shrink-0 w-80"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Luxury Product Card */}
                  <div 
                    className="group cursor-pointer transition-all duration-500 group-hover:-translate-y-2"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Premium Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-[#FBF7EF] rounded-2xl mb-5 border border-[#E8E1D0] shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      {/* Image with elegant overlay */}
                      <img 
                        src={getImageUrl(product.image)}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          hoveredProduct === product.id ? 'scale-110' : 'scale-100'
                        }`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop&crop=center';
                          e.target.className = 'w-full h-full object-cover';
                        }}
                      />
                      
                      {/* Luxury gradient overlay */}
                      <div className={`absolute inset-0 bg-linear-to-t from-[#2C1810]/40 via-transparent to-transparent transition-all duration-500 ${
                        hoveredProduct === product.id ? 'opacity-100' : 'opacity-60'
                      }`}></div>
                      
                      {/* Gold border on hover */}
                      <div className={`absolute inset-0 border-2 border-transparent rounded-2xl transition-all duration-500 ${
                        hoveredProduct === product.id ? 'border-[#B89B6F]' : ''
                      }`}></div>
                      
                      {/* Premium Badges */}
                      {product.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-4 py-2 bg-[#2C1810]/90 backdrop-blur-sm text-xs text-[#FEFCF5] font-light tracking-wider rounded-full border border-[#B89B6F]/30">
                            {product.category.toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      {/* Wishlist Button - Luxury */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-500 ${
                          hoveredProduct === product.id 
                            ? 'opacity-100 translate-x-0 bg-white/90 shadow-xl' 
                            : 'opacity-0 translate-x-4'
                        } ${isInWishlist(product.id) ? 'text-red-600 bg-white' : 'text-[#2C1810]'}`}
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                          />
                        </svg>
                      </button>
                      
                      {/* Quick Add to Cart - Luxury */}
                      <div className={`absolute bottom-0 left-0 right-0 transform transition-all duration-500 ${
                        hoveredProduct === product.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full bg-[#2C1810] text-[#FEFCF5] py-4 text-sm font-light tracking-wider hover:bg-[#B89B6F] transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                    
                    {/* Luxury Product Info */}
                    <div className="px-2">
                      {/* Product Name with underline effect */}
                      <h3 className="text-[#2C1810] font-light text-lg mb-3 line-clamp-1 group-hover:text-[#B89B6F] transition-colors duration-300 tracking-wide relative">
                        {product.name}
                        <span className={`absolute left-0 bottom-0 h-px bg-linear-to-r from-[#B89B6F] to-transparent transition-all duration-300 ${
                          hoveredProduct === product.id ? 'w-full' : 'w-0'
                        }`}></span>
                      </h3>
                      
                      {/* Price Section - Luxury */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E1D0]">
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl font-normal text-[#2C1810]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[#8B7355] text-sm line-through font-light">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        
                        {/* Premium Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-4 h-4"
                                  fill={i < Math.floor(product.rating) ? "#B89B6F" : "none"}
                                  stroke={i < Math.floor(product.rating) ? "#B89B6F" : "#E8E1D0"}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                  />
                                </svg>
                              ))}
                            </div>
                            <span className="text-[#5A4738] text-xs font-light">
                              {product.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* View Details - Luxury */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="text-sm text-[#5A4738] hover:text-[#B89B6F] font-light tracking-wider transition-colors duration-300 flex items-center gap-2 group"
                        >
                          EXPLORE DETAILS
                          <svg 
                            className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Stock Status */}
                        {product.stock && product.stock < 10 && (
                          <span className="text-xs text-[#B89B6F] font-light tracking-wider">
                            LOW STOCK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Luxury Navigation Buttons */}
            {showLeftButton && (
              <button 
                onClick={scrollLeft}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-[#E8E1D0] rounded-full p-3 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 hover:border-[#B89B6F]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2C1810]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {showRightButton && (
              <button 
                onClick={scrollRight}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-[#E8E1D0] rounded-full p-3 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 hover:border-[#B89B6F]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2C1810]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Luxury Features Section */}
      <div className="bg-[#FBF7EF] py-24 border-t border-[#E8E1D0]">
        <div className="max-w-7xl mx-auto px-0">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl font-light text-[#2C1810] mb-4 tracking-wide">THE ART OF CRAFT</h2>
            <div className="h-px w-24 mx-auto bg-linear-to-r from-transparent via-[#B89B6F] to-transparent mb-6"></div>
            <p className="text-[#5A4738] max-w-2xl mx-auto font-light tracking-wider">
              Where tradition meets unparalleled excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {/* Feature 1 - Premium */}
            <div className="bg-white p-8 rounded-2xl border border-[#E8E1D0] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#2C1810] to-[#B89B6F] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-light text-[#2C1810] mb-3 tracking-wide">ARTISAN HERITAGE</h3>
                <p className="text-[#5A4738] text-sm font-light leading-relaxed">
                  Each piece crafted by master artisans, preserving traditional techniques with modern precision and attention to detail.
                </p>
              </div>
            </div>
            
            {/* Feature 2 - Premium */}
            <div className="bg-white p-8 rounded-2xl border border-[#E8E1D0] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#2C1810] to-[#B89B6F] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-light text-[#2C1810] mb-3 tracking-wide">PREMIUM MATERIALS</h3>
                <p className="text-[#5A4738] text-sm font-light leading-relaxed">
                  Sourced from the world's finest suppliers, ensuring unparalleled quality, durability, and timeless elegance.
                </p>
              </div>
            </div>
            
            {/* Feature 3 - Premium */}
            <div className="bg-white p-8 rounded-2xl border border-[#E8E1D0] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#2C1810] to-[#B89B6F] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-light text-[#2C1810] mb-3 tracking-wide">PERSONAL SERVICE</h3>
                <p className="text-[#5A4738] text-sm font-light leading-relaxed">
                  Dedicated support and personalized guidance throughout your luxury journey, ensuring an exceptional experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
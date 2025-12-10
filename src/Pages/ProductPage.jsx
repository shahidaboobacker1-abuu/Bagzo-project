import { api } from '../API/Axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../Context/CartProvider';
import { useWishlist } from '../Context/WishlistProvider';
import { useAuth } from '../Context/AuthProvider';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import { useEffect, useState } from 'react';

function ProductPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterFromUrl = searchParams.get('filter');
    
    if (filterFromUrl) {
      setSelectedFilter(filterFromUrl.toLowerCase());
    }
  }, [location.search]);

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      const filteredProducts = response.data.filter(product => 
        !product.name.toLowerCase().includes('store image')
      );
      setProducts(filteredProducts);
      setFilteredProducts(filteredProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

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

  // Extract unique categories for filter
  const categories = ['all'];
  const productNames = ['all', ...new Set(products
    .map(product => product.name)
    .filter(name => name && !name.toLowerCase().includes('store image'))
  )];

  useEffect(() => {
    let filtered = [...products];

    // Filter by product name
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.name && product.name.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedFilter, sortBy]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

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
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFCF5]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-4 border-[#E8E1D0] border-t-[#B89B6F] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#5A4738] font-light tracking-wide">Loading our luxury collection...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FEFCF5]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32">
          <div className="text-center">
            <div className="text-[#B89B6F] text-6xl mb-4">✦</div>
            <h3 className="text-2xl font-light text-[#2C1810] mb-2">Unable to Load Collection</h3>
            <p className="text-[#5A4738] mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-8 py-3 bg-[#2C1810] text-white hover:bg-[#B89B6F] transition-all duration-300 font-light tracking-wider hover:scale-105"
            >
              RETRY
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
      <Navbar />
      
      {/* Luxury Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-[#2C1810] mb-6">
              <span className="block">COLLECTION</span>
            </h1>
            <p className="text-[#5A4738] text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10 tracking-wider">
              Exquisite craftsmanship meets timeless elegance
            </p>
            <div className="h-px w-32 mx-auto bg-linear-to-r from-transparent via-[#B89B6F] to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Luxury Filters & Controls */}
      <div className="sticky top-0 z-20 bg-[#FEFCF5]/95 backdrop-blur-sm border-b border-[#E8E1D0]">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Quick Categories */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#5A4738] font-light tracking-wider uppercase">Collections</span>
              <div className="flex gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedFilter(category === 'all' ? 'all' : '')}
                    className={`px-5 py-2.5 text-sm font-light tracking-wider transition-all duration-300 rounded-full ${
                      selectedFilter === category 
                        ? 'bg-[#2C1810] text-[#FEFCF5] shadow-lg' 
                        : 'text-[#5A4738] hover:text-[#2C1810] hover:bg-white hover:shadow-md'
                    }`}
                  >
                    {category.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#5A4738] font-light tracking-wider">SORT</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-[#E8E1D0] bg-transparent text-[#2C1810] text-sm font-light tracking-wider focus:outline-none focus:ring-1 focus:ring-[#B89B6F] px-4 py-2 rounded-full"
                >
                  <option value="featured">FEATURED</option>
                  <option value="price-low">PRICE: LOW TO HIGH</option>
                  <option value="price-high">PRICE: HIGH TO LOW</option>
                  <option value="name">NAME</option>
                  <option value="rating">RATING</option>
                </select>
              </div>
              
              <div className="w-px h-8 bg-[#E8E1D0]"></div>
              
              <div className="text-sm text-[#5A4738] font-light tracking-wider">
                <span className="text-[#2C1810] font-normal">{filteredProducts.length}</span> ITEMS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-[#E8E1D0] text-6xl mb-4">✦</div>
            <h3 className="text-2xl font-light text-[#2C1810] mb-2">No Products Found</h3>
            <p className="text-[#5A4738] mb-8 max-w-md mx-auto">
              Try adjusting your filters or browse our complete collection
            </p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="px-8 py-3 border border-[#E8E1D0] text-[#2C1810] hover:border-[#B89B6F] hover:text-[#B89B6F] transition-all duration-300 font-light tracking-wider hover:scale-105"
            >
              VIEW ALL PRODUCTS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Luxury Product Card */}
                <div 
                  className="relative cursor-pointer transition-all duration-500 group-hover:-translate-y-2"
                  onClick={() => handleProductClick(product.id)}
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
                        onClick={() => handleProductClick(product.id)}
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
        )}
      </div>

      {/* Luxury Features Section */}
      <div className="bg-[#FBF7EF] py-24 border-t border-[#E8E1D0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-[#2C1810] mb-4 tracking-wide">THE ART OF CRAFT</h2>
            <div className="h-px w-24 mx-auto bg-linear-to-r from-transparent via-[#B89B6F] to-transparent mb-6"></div>
            <p className="text-[#5A4738] max-w-2xl mx-auto font-light tracking-wider">
              Where tradition meets unparalleled excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      <Footer />
    </div>
  );
}

export default ProductPage;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { useWishlist } from '../Context/WishlistProvider';
import { useCart } from '../Context/CartProvider';

function Navbar() {
  const [showOffer, setShowOffer] = useState(true);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();
  const { getWishlistCount } = useWishlist();
  const { getTotalItems } = useCart();

  // Effects
  useEffect(() => {
    fetchAllProducts();
    const timer = setTimeout(() => setShowOffer(false), 5000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Functions
  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/products');
      const products = await response.json();
      setAllProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filteredProducts.slice(0, 5));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSearchResults(false);
    setShowMobileMenu(false);
  };

  const formatPrice = (price) => {
    return `₹${typeof price === 'number' ? price.toLocaleString('en-IN') : price}`;
  };

  const handleIconClick = (iconName, event) => {
    if (event) {
      event.stopPropagation();
    }

    if (!isAuthenticated && (iconName === 'Account' || iconName === 'Wishlist' || iconName === 'Orders')) {
      navigate('/login');
      return;
    }

    switch (iconName) {
      case 'Account':
        setShowAccountDropdown(prev => !prev);
        break;
      case 'Wishlist':
        navigate('/wishlist');
        break;
      case 'Cart':
        navigate('/cart');
        break;
      case 'Orders':
        navigate('/orders');
        break;
      default:
        break;
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowMobileMenu(false);
    setShowAccountDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setShowAccountDropdown(false);
    setShowMobileMenu(false);
    navigate('/');
  };

  // Search Results Component
  const SearchResults = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 z-50 max-h-96 overflow-y-auto backdrop-blur-sm">
      <div className="p-3">
        {searchResults.map((product) => (
          <div
            key={product.id}
            className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 group border-b border-gray-100 last:border-b-0"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative w-12 h-12 mr-3 overflow-hidden rounded-md border border-gray-200 group-hover:border-gray-300">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/48x48?text=Image';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate group-hover:text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-light mt-0.5">{product.category}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
        <div className="pt-3 mt-1">
          <button
            onClick={() => handleNavigation(`/products?search=${encodeURIComponent(searchQuery.trim())}`)}
            className="w-full text-center py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 border border-gray-200 hover:border-gray-300 rounded-lg hover:bg-gray-50"
          >
            View all results ({searchResults.length})
          </button>
        </div>
      </div>
    </div>
  );

  // NavIcon Component
  const NavIcon = ({ iconName, iconSvg, label, count, onClick }) => (
    <div
      className="relative flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 group"
      onClick={(e) => onClick(iconName, e)}
    >
      <div className="relative p-2">
        <div className="absolute inset-0 bg-amber-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        {iconSvg}
        {count > 0 && (
          <span className={`absolute -top-1 -right-1 text-[#624a2e] text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold z-10 ${iconName === 'Cart' ? 'bg-amber-100' : 'bg-amber-200'
            }`}>
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-light text-amber-100 uppercase tracking-wider mt-1 group-hover:text-amber-50 transition-colors duration-300">
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-full font-sans">
      {/* Top Announcement Bar - Gold Gradient */}
      {/* Top Announcement Bar - Subtle */}
      <div className={`bg-linear-to-r from-[#AF8F6F] to-[#74512D] transition-all duration-700 ease-in-out overflow-hidden border-b border-[#AF8F6F] ${showOffer ? "max-h-10 opacity-100 py-2" : "max-h-0 opacity-0 py-0"
        }`}>
        <div className="flex items-center justify-center px-5 max-w-7xl mx-auto">
          <h3 className="text-xs font-light tracking-wider text-[#F8F4E1] m-0 text-center">
            Get 10% Off On Your First Purchase
          </h3>
        </div>
      </div>

      {/* Main Navigation Bar - Luxury Leather Brown */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-[#624a2e] shadow-lg border-b border-amber-700/30'
          : 'bg-[#624a2e] border-b border-amber-700/20'
        }`}>
        <div className="flex justify-between items-center px-6 md:px-12 py-3 max-w-7xl mx-auto">

          {/* Brand Logo */}
          <div className="shrink-0">
            <h1
              className="text-xl md:text-2xl font-light text-amber-50 tracking-widest uppercase cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => navigate('/')}
            >
              BAGZO
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => navigate('/products')}
              className="text-sm font-light text-amber-100 uppercase tracking-wider hover:text-amber-50 transition-all duration-300 relative group"
            >
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-50 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-sm font-light text-amber-100 uppercase tracking-wider hover:text-amber-50 transition-all duration-300 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-50 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-sm font-light text-amber-100 uppercase tracking-wider hover:text-amber-50 transition-all duration-300 relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-50 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Right Section - Search & Icons */}
          <div className="flex items-center space-x-6">

            {/* Search Bar */}
            <div className="hidden lg:block relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search bags..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearch}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  className="w-48 px-4 py-2 pl-10 text-sm bg-amber-50/90 border border-[#AF8F6F] rounded-full text-stone-800 placeholder-[#2C1810] focus:outline-none focus:border-[#74512D] focus:ring-1 focus:ring-[#AF8F6F] transition-all duration-300 shadow-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4  text-[#2C1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {showSearchResults && searchResults.length > 0 && <SearchResults />}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">

              {/* Account Dropdown */}
              <div ref={dropdownRef} className="relative">
                <NavIcon
                  iconName="Account"
                  iconSvg={
                    <svg className="w-5 h-5 text-amber-100 group-hover:text-amber-50 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  onClick={handleIconClick}
                />

                {showAccountDropdown && isAuthenticated && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-amber-50 rounded-lg shadow-xl py-2 z-50 border border-amber-300">
                    <div className="px-4 py-2 text-sm text-stone-700 border-b border-amber-200">
                      Welcome, <br /><span className="font-medium text-[#624a2e]">{user?.name}</span>
                    </div>
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:text-[#624a2e] hover:bg-amber-100 transition-all duration-200"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => handleNavigation('/orders')}
                      className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:text-[#624a2e] hover:bg-amber-100 transition-all duration-200"
                    >
                      My Orders
                    </button>
                    <div className="border-t border-amber-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-amber-700 hover:text-[#624a2e] hover:bg-amber-100 transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <NavIcon
                iconName="Wishlist"
                iconSvg={
                  <svg className="w-5 h-5 text-amber-100 group-hover:text-amber-50 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
                count={isAuthenticated ? getWishlistCount() : 0}
                onClick={handleIconClick}
              />

              {/* Cart */}
              <NavIcon
                iconName="Cart"
                iconSvg={
                  <svg className="w-5 h-5 text-amber-100 group-hover:text-amber-50 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
                count={getTotalItems()}
                onClick={handleIconClick}
              />

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-amber-100 hover:text-amber-50 transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-[#624a2e] border-t border-amber-600/30">
            <div className="px-6 py-4">
              {/* Mobile Search */}
              <div className="relative mb-4" ref={searchRef}>
                <input
                  type="search"
                  placeholder="Search bags..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearch}
                  className="w-full px-4 py-2 pl-10 text-sm bg-amber-50/90 border border-amber-300/70 rounded-lg text-stone-800 placeholder-amber-700/70 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300 transition-all duration-300 shadow-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <button
                  onClick={() => handleNavigation('/products')}
                  className="block w-full text-left px-4 py-3 text-sm text-amber-100 hover:text-amber-50 hover:bg-amber-700/30 rounded-lg transition-all duration-300 font-medium uppercase tracking-wider"
                >
                  Collections
                </button>

                <button
                  onClick={() => handleNavigation('/about')}
                  className="block w-full text-left px-4 py-3 text-sm text-amber-100 hover:text-amber-50 hover:bg-amber-700/30 rounded-lg transition-all duration-300 font-medium uppercase tracking-wider"
                >
                  About
                </button>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="block w-full text-left px-4 py-3 text-sm text-amber-100 hover:text-amber-50 hover:bg-amber-700/30 rounded-lg transition-all duration-300 font-medium uppercase tracking-wider"
                >
                  Contact
                </button>

                {isAuthenticated && (
                  <>
                    <div className="border-t border-amber-600/30 my-2 pt-2">
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="block w-full text-left px-4 py-3 text-sm text-amber-100 hover:text-amber-50 hover:bg-amber-700/30 rounded-lg transition-all duration-300 font-medium"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={() => handleNavigation('/orders')}
                        className="block w-full text-left px-4 py-3 text-sm text-amber-100 hover:text-amber-50 hover:bg-amber-700/30 rounded-lg transition-all duration-300 font-medium"
                      >
                        My Orders
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile User Section */}
              <div className="border-t border-amber-600/30 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-amber-100 mb-2">
                      Welcome, <span className="font-medium text-amber-50">{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center py-3 text-sm font-medium text-amber-100 hover:text-amber-50 border border-amber-600/50 hover:border-amber-500 hover:bg-amber-700/30 rounded-lg transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigation('/login')}
                      className="w-full text-center py-3 text-sm font-medium text-amber-100 hover:text-amber-50 border border-amber-600/50 hover:border-amber-500 hover:bg-amber-700/30 rounded-lg transition-all duration-300 mb-2"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleNavigation('/register')}
                      className="w-full text-center py-3 text-sm font-medium text-white bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-lg transition-all duration-300 shadow-md"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
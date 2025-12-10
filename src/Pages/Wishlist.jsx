// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useWishlist } from '../Context/WishlistProvider';
// import { useAuth } from '../Context/AuthProvider';

// function Wishlist() {
//   const { wishlist, removeFromWishlist, clearWishlist, loading } = useWishlist();
//   const { isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const handleRemoveItem = (productId) => {
//     removeFromWishlist(productId);
//   };

//   const handleClearWishlist = () => {
//     if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
//       clearWishlist();
//     }
//   };

//   const handleContinueShopping = () => {
//     navigate('/products');
//   };

//   const handleProductClick = (productId) => {
//     navigate(`/product/${productId}`);
//   };

//   // Format price in Indian Rupees
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-[#F8F4E1] py-16">
//         <div className="max-w-4xl mx-auto px-4">
//           <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-[#E0D6C2]">
//             <h2 className="text-3xl font-light text-[#2C1810] mb-6 tracking-wide">LOGIN REQUIRED</h2>
//             <div className="w-16 h-0.5 bg-[#AF8F6F] mx-auto mb-8"></div>
//             <p className="text-[#5A4738] mb-8 font-light max-w-md mx-auto">Please login to view your wishlist.</p>
//             <button
//               onClick={() => navigate('/login')}
//               className="bg-[#2C1810] text-white px-8 py-4 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
//             >
//               SIGN IN
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F4E1] py-12">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-light text-[#2C1810] mb-4 tracking-wide">MY WISHLIST</h1>
//           <div className="w-24 h-0.5 bg-[#AF8F6F] mx-auto mb-6"></div>
//           <p className="text-lg text-[#5A4738] font-light">
//             {wishlist.length === 0 
//               ? "Your wishlist is empty" 
//               : `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`
//             }
//           </p>
//         </div>

//         {wishlist.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-[#E0D6C2]">
//             <div className="w-28 h-28 mx-auto mb-8 text-[#AF8F6F]">
//               <svg fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
//               </svg>
//             </div>
//             <h3 className="text-3xl font-light text-[#2C1810] mb-6 tracking-wide">YOUR WISHLIST IS EMPTY</h3>
//             <div className="w-20 h-0.5 bg-[#AF8F6F] mx-auto mb-8"></div>
//             <p className="text-[#5A4738] mb-12 max-w-md mx-auto font-light leading-relaxed">
//               Start adding your favorite products to your wishlist. They'll be saved here for you to revisit later.
//             </p>
//             <button
//               onClick={handleContinueShopping}
//               className="bg-[#2C1810] text-white px-10 py-4 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
//             >
//               CONTINUE SHOPPING
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {/* Wishlist Actions */}
//             <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-xl p-8 border border-[#E0D6C2]">
//               <div className="mb-4 md:mb-0">
//                 <span className="text-[#2C1810] font-light tracking-wide text-lg">
//                   {wishlist.length} ITEM{wishlist.length !== 1 ? 'S' : ''} IN WISHLIST
//                 </span>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//                 <button
//                   onClick={handleClearWishlist}
//                   className="text-[#AF8F6F] hover:text-[#5A4738] font-light transition-colors duration-300 tracking-wide px-6 py-3 border border-[#E0D6C2] rounded-full hover:border-[#AF8F6F]"
//                 >
//                   CLEAR ALL
//                 </button>
//                 <button
//                   onClick={handleContinueShopping}
//                   className="bg-[#2C1810] text-white px-8 py-3 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
//                 >
//                   CONTINUE SHOPPING
//                 </button>
//               </div>
//             </div>

//             {/* Wishlist Items */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {wishlist.map((product) => (
//                 <div
//                   key={product.id}
//                   className="bg-white rounded-2xl shadow-xl border border-[#E0D6C2] hover:shadow-2xl hover:border-[#AF8F6F]/30 transition-all duration-500 group"
//                 >
//                   {/* Product Image */}
//                   <div 
//                     className="relative overflow-hidden rounded-t-2xl cursor-pointer"
//                     onClick={() => handleProductClick(product.id)}
//                   >
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/400x400/F8F4E1/2C1810?text=BagZo+Luxury';
//                       }}
//                     />
                    
//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
//                     {/* Badges */}
//                     <div className="absolute top-4 left-4 flex flex-col gap-2">
//                       {product.isNew && (
//                         <span className="bg-[#2C1810] text-white text-xs px-4 py-2 rounded-full font-light tracking-wider">
//                           NEW
//                         </span>
//                       )}
//                       {product.isOnSale && (
//                         <span className="bg-[#AF8F6F] text-white text-xs px-4 py-2 rounded-full font-light tracking-wider">
//                           SALE
//                         </span>
//                       )}
//                     </div>

//                     {/* Remove Button */}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleRemoveItem(product.id);
//                       }}
//                       className="absolute top-4 right-4 bg-white hover:bg-[#AF8F6F] text-[#AF8F6F] hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-[#E0D6C2] hover:border-[#AF8F6F] hover:scale-110"
//                       title="Remove from wishlist"
//                     >
//                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
//                       </svg>
//                     </button>
//                   </div>

//                   {/* Product Info */}
//                   <div className="p-6">
//                     {/* Category */}
//                     {product.category && (
//                       <p className="text-xs text-[#AF8F6F] font-light uppercase tracking-wider mb-3">
//                         {product.category}
//                       </p>
//                     )}

//                     {/* Product Name */}
//                     <h3 
//                       className="font-light text-xl text-[#2C1810] mb-3 line-clamp-2 hover:text-[#AF8F6F] transition-colors cursor-pointer tracking-wide group-hover:translate-x-1 duration-300"
//                       onClick={() => handleProductClick(product.id)}
//                     >
//                       {product.name}
//                     </h3>

//                     {/* Rating */}
//                     {product.rating && (
//                       <div className="flex items-center mb-4">
//                         <div className="flex items-center">
//                           {[...Array(5)].map((_, i) => (
//                             <svg
//                               key={i}
//                               className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#AF8F6F] fill-current' : 'text-[#E0D6C2] fill-current'}`}
//                               viewBox="0 0 20 20"
//                             >
//                               <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
//                             </svg>
//                           ))}
//                         </div>
//                         <span className="text-sm text-[#5A4738] ml-2 font-light">({product.rating})</span>
//                       </div>
//                     )}

//                     {/* Price */}
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-3">
//                         <span className="text-2xl font-light text-[#2C1810]">
//                           {formatPrice(product.price)}
//                         </span>
//                         {product.originalPrice && product.originalPrice > product.price && (
//                           <span className="text-sm text-[#AF8F6F] line-through font-light">
//                             {formatPrice(product.originalPrice)}
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Added Date */}
//                     <div className="mt-4 pt-4 border-t border-[#E0D6C2]">
//                       <p className="text-xs text-[#5A4738] font-light">
//                         Added on {new Date(product.addedAt).toLocaleDateString('en-IN', {
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric'
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {loading && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
//             <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#E0D6C2]">
//               <div className="flex items-center space-x-4">
//                 <svg className="animate-spin h-6 w-6 text-[#AF8F6F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span className="text-[#2C1810] font-light tracking-wide">UPDATING WISHLIST...</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Wishlist;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../Context/WishlistProvider';
import { useAuth } from '../Context/AuthProvider';

function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist, loading } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});

  const handleRemoveItem = (productId) => {
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle image errors
  const handleImageError = (productId, imageUrl) => {
    console.error(`Failed to load image for product ${productId}:`, imageUrl);
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  // Get image URL with fallback
  const getImageUrl = (product) => {
    if (imageErrors[product.id]) {
      return `https://via.placeholder.com/400x400/F8F4E1/74512D?text=${encodeURIComponent(product.name || 'BagZo')}`;
    }
    
    // If product.image is a relative path starting with /assets
    if (product.image && product.image.startsWith('/assets')) {
      return product.image; // This will work if images are in public/assets
    }
    
    // If product.image is a URL
    if (product.image && (product.image.startsWith('http') || product.image.startsWith('data:'))) {
      return product.image;
    }
    
    // Default fallback
    return `https://via.placeholder.com/400x400/F8F4E1/74512D?text=${encodeURIComponent(product.name || 'BagZo+Luxury')}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-[#E0D6C2]">
            <h2 className="text-3xl font-light text-[#543310] mb-6 tracking-wide">LOGIN REQUIRED</h2>
            <div className="w-16 h-0.5 bg-[#AF8F6F] mx-auto mb-8"></div>
            <p className="text-[#74512D] mb-8 font-light max-w-md mx-auto">Please login to view your wishlist.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#543310] text-white px-8 py-4 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4E1] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-[#543310] mb-4 tracking-wide">MY WISHLIST</h1>
          <div className="w-24 h-0.5 bg-[#AF8F6F] mx-auto mb-6"></div>
          <p className="text-lg text-[#74512D] font-light">
            {wishlist.length === 0 
              ? "Your wishlist is empty" 
              : `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`
            }
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-[#E0D6C2]">
            <div className="w-28 h-28 mx-auto mb-8 text-[#AF8F6F]">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="text-3xl font-light text-[#543310] mb-6 tracking-wide">YOUR WISHLIST IS EMPTY</h3>
            <div className="w-20 h-0.5 bg-[#AF8F6F] mx-auto mb-8"></div>
            <p className="text-[#74512D] mb-12 max-w-md mx-auto font-light leading-relaxed">
              Start adding your favorite products to your wishlist. They'll be saved here for you to revisit later.
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-[#543310] text-white px-10 py-4 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Wishlist Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-xl p-8 border border-[#E0D6C2]">
              <div className="mb-4 md:mb-0">
                <span className="text-[#543310] font-light tracking-wide text-lg">
                  {wishlist.length} ITEM{wishlist.length !== 1 ? 'S' : ''} IN WISHLIST
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button
                  onClick={handleClearWishlist}
                  className="text-[#AF8F6F] hover:text-[#74512D] font-light transition-colors duration-300 tracking-wide px-6 py-3 border border-[#E0D6C2] rounded-full hover:border-[#AF8F6F]"
                >
                  CLEAR ALL
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="bg-[#543310] text-white px-8 py-3 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((product) => {
                const imageUrl = getImageUrl(product);
                
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-xl border border-[#E0D6C2] hover:shadow-2xl hover:border-[#AF8F6F]/30 transition-all duration-500 group"
                  >
                    {/* Product Image */}
                    <div 
                      className="relative overflow-hidden rounded-t-2xl cursor-pointer bg-[#F8F4E1] min-h-72 flex items-center justify-center"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => handleImageError(product.id, product.image)}
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-[#543310]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="bg-[#543310] text-white text-xs px-4 py-2 rounded-full font-light tracking-wider">
                            NEW
                          </span>
                        )}
                        {product.isOnSale && (
                          <span className="bg-[#AF8F6F] text-white text-xs px-4 py-2 rounded-full font-light tracking-wider">
                            SALE
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(product.id);
                        }}
                        className="absolute top-4 right-4 bg-white hover:bg-[#AF8F6F] text-[#AF8F6F] hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-[#E0D6C2] hover:border-[#AF8F6F] hover:scale-110"
                        title="Remove from wishlist"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      {/* Category */}
                      {product.category && (
                        <p className="text-xs text-[#AF8F6F] font-light uppercase tracking-wider mb-3">
                          {product.category}
                        </p>
                      )}

                      {/* Product Name */}
                      <h3 
                        className="font-light text-xl text-[#543310] mb-3 line-clamp-2 hover:text-[#AF8F6F] transition-colors cursor-pointer tracking-wide group-hover:translate-x-1 duration-300"
                        onClick={() => handleProductClick(product.id)}
                      >
                        {product.name}
                      </h3>

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#AF8F6F] fill-current' : 'text-[#E0D6C2] fill-current'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-[#74512D] ml-2 font-light">({product.rating})</span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-light text-[#543310]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-[#AF8F6F] line-through font-light">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Added Date */}
                      {product.addedAt && (
                        <div className="mt-4 pt-4 border-t border-[#E0D6C2]">
                          <p className="text-xs text-[#74512D] font-light">
                            Added on {new Date(product.addedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#E0D6C2]">
              <div className="flex items-center space-x-4">
                <svg className="animate-spin h-6 w-6 text-[#AF8F6F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-[#543310] font-light tracking-wide">UPDATING WISHLIST...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
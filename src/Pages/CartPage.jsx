import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartProvider';
import Navbar from '../Component/Navbar';

function CartPage() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    clearCart,
    isCartEmpty,
    getCartSummary 
  } = useCart();
  
  const navigate = useNavigate();

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Show empty cart message if no items
  if (isCartEmpty()) {
    return (
      <div className="min-h-screen bg-[#F8F4E1]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E0D6C2] p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg 
                className="w-24 h-24 text-[#AF8F6F] mx-auto mb-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
              </svg>
              <h2 className="text-3xl font-light text-[#2C1810] mb-4 tracking-wide">YOUR CART IS EMPTY</h2>
              <div className="w-16 h-0.5 bg-[#AF8F6F] mx-auto mb-6"></div>
              <p className="text-[#5A4738] mb-8 font-light leading-relaxed">
                Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!
              </p>
              <button
                onClick={handleContinueShopping}
                className="bg-[#2C1810] text-white px-8 py-4 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cartSummary = getCartSummary();

  return (
    <div className="min-h-screen bg-[#F8F4E1]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-4xl font-light text-[#2C1810] mb-2 tracking-wide">SHOPPING CART</h1>
            <div className="w-24 h-0.5 bg-[#AF8F6F]"></div>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button
              onClick={clearCart}
              className="text-[#AF8F6F] hover:text-[#5A4738] font-light transition-colors duration-300 tracking-wide"
            >
              CLEAR CART
            </button>
            <span className="text-[#2C1810] font-light">
              {cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'ITEM' : 'ITEMS'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-xl border border-[#E0D6C2] p-8 transition-all duration-300 hover:shadow-2xl hover:border-[#AF8F6F]/30">
                <div className="flex flex-col sm:flex-row gap-8">
                  {/* Product Image */}
                  <div className="shrink-0">
                    <div className="relative group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-36 h-36 object-cover rounded-xl border border-[#E0D6C2] group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x150/F8F4E1/2C1810?text=BagZo';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 
                          className="text-xl font-light text-[#2C1810] hover:text-[#AF8F6F] cursor-pointer transition-colors duration-300 tracking-wide"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        {item.category && (
                          <p className="text-sm text-[#AF8F6F] font-light mt-1 tracking-wide">{item.category.toUpperCase()}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[#AF8F6F] hover:text-[#5A4738] transition-colors duration-300 hover:scale-110"
                        title="Remove from cart"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#E0D6C2] rounded-xl">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-4 py-2 text-[#2C1810] hover:bg-[#F8F4E1] transition-colors duration-300 disabled:opacity-50 font-light"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-6 py-2 text-[#2C1810] font-light min-w-12 text-center border-x border-[#E0D6C2]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-4 py-2 text-[#2C1810] hover:bg-[#F8F4E1] transition-colors duration-300 font-light"
                        >
                          +
                        </button>
                      </div>

                      {/* Price Section */}
                      <div className="text-right">
                        <div className="text-2xl font-light text-[#2C1810]">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="mt-2">
                            <p className="text-sm text-[#AF8F6F] line-through font-light">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </p>
                            <p className="text-sm text-green-600 font-light">
                              Save {formatPrice((item.originalPrice - item.price) * item.quantity)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E0D6C2] p-8 sticky top-8">
              <h2 className="text-2xl font-light text-[#2C1810] mb-6 tracking-wide">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-[#5A4738]">
                  <span className="font-light">SUBTOTAL ({cartSummary.itemCount} ITEMS)</span>
                  <span className="font-light">{formatPrice(parseFloat(cartSummary.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm text-[#5A4738]">
                  <span className="font-light">SHIPPING</span>
                  <span className="text-green-600 font-light">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-[#5A4738]">
                  <span className="font-light">TAX (10%)</span>
                  <span className="font-light">{formatPrice(parseFloat(cartSummary.tax))}</span>
                </div>
                <div className="border-t border-[#E0D6C2] pt-4">
                  <div className="flex justify-between text-xl font-light text-[#2C1810]">
                    <span>TOTAL</span>
                    <span>{formatPrice(parseFloat(cartSummary.total))}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#2C1810] text-white py-4 px-6 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl mb-4 tracking-wide text-lg"
              >
                PROCEED TO CHECKOUT
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full border-2 border-[#E0D6C2] text-[#2C1810] py-4 px-6 rounded-full font-light hover:border-[#AF8F6F] hover:text-[#AF8F6F] transition-all duration-300 hover:scale-[1.02] tracking-wide"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
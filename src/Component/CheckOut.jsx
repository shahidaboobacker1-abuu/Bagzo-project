// Pages/CheckoutPage/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartProvider';
import { useAuth } from '../Context/AuthProvider';

function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart, addToOrderHistory, getCartSummary } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.1;
    const shipping = 0;
    const codFee = formData.paymentMethod === 'cod' ? 50 : 0;
    return (subtotal + tax + shipping + codFee).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.paymentMethod === 'card' && (!formData.cardNumber || !formData.expiry || !formData.cvv)) {
      alert('Please fill in all card details');
      return;
    }

    if (formData.paymentMethod === 'upi' && !formData.upiId) {
      alert('Please enter your UPI ID');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order in history before clearing cart
      const orderData = {
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'completed',
        orderStatus: 'confirmed'
      };
      
      const newOrder = addToOrderHistory(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to success page
      navigate('/order-success', { 
        state: { 
          orderId: newOrder.id,
          total: calculateTotal(),
          paymentMethod: formData.paymentMethod
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cartSummary = getCartSummary();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F4E1]">
        {/* Navigation Bar */}
        <nav className="bg-[#F8F4E1] py-4 px-6 border-b border-[#E0D6C2]">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-light tracking-wide text-[#2C1810]">
              BAG COLLECTION
            </div>
            <div className="flex space-x-6">
              <button 
                onClick={() => navigate('/products')}
                className="text-sm hover:text-[#AF8F6F] transition-colors text-[#2C1810] font-light"
              >
                Collections
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-sm hover:text-[#AF8F6F] transition-colors text-[#2C1810] font-light"
              >
                About
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="text-sm hover:text-[#AF8F6F] transition-colors text-[#2C1810] font-light"
              >
                Contact
              </button>
            </div>
          </div>
        </nav>
        
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-[#F8F4E1] rounded-2xl shadow-lg p-12 text-center border border-[#E0D6C2]">
            <h2 className="text-2xl font-light text-[#2C1810] mb-4 tracking-wide">Your Cart is Empty</h2>
            <p className="text-[#5A4738] font-light mb-8">Please add items to your cart before checkout.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#AF8F6F] text-white px-8 py-3 rounded-lg font-light tracking-wide hover:bg-[#8B6F47] transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4E1]">
      {/* Navigation Bar */}
      <nav className="bg-[#F8F4E1] py-4 px-6 border-b border-[#E0D6C2]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-light tracking-wide text-[#2C1810]">
            BAG COLLECTION
          </div>
          <div className="flex space-x-6">
            <button 
              onClick={() => navigate('/products')}
              className="text-sm hover:text-[#AF8F6F] transition-colors text-[#2C1810] font-light"
            >
              Collections
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="text-sm hover:text-[#AF8F6F] transition-colors text-[#2C1810] font-light"
            >
              About
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="text-sm hover:text-[#AF8F6F] transition-colors text-[#2C1810] font-light"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-2">
            <span className="text-[#AF8F6F] text-sm font-light tracking-wider uppercase">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light mb-4 leading-tight text-[#2C1810] tracking-wide">
            Complete Your Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-[#F8F4E1] rounded-xl shadow-lg p-6 border border-[#E0D6C2]">
              <h2 className="text-xl font-light text-[#2C1810] mb-4 tracking-wide">Delivery Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Enter PIN code"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#F8F4E1] rounded-xl shadow-lg p-6 border border-[#E0D6C2]">
              <h2 className="text-xl font-light text-[#2C1810] mb-4 tracking-wide">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Credit/Debit Card */}
                <label className={`flex items-center space-x-3 p-4 border rounded-lg hover:border-[#AF8F6F] cursor-pointer transition-colors duration-200 ${
                  formData.paymentMethod === 'card' ? 'border-[#AF8F6F] bg-[#F0E9D8]' : 'border-[#E0D6C2] hover:bg-[#F0E9D8]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="text-[#AF8F6F] focus:ring-[#AF8F6F]"
                  />
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-[#5A4738]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    <span className="font-light text-[#2C1810] tracking-wide">Credit/Debit Card</span>
                  </div>
                </label>

                {formData.paymentMethod === 'card' && (
                  <div className="ml-8 space-y-4 p-4 bg-[#F0E9D8] rounded-lg border border-[#E0D6C2]">
                    <div>
                      <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment */}
                <label className={`flex items-center space-x-3 p-4 border rounded-lg hover:border-[#AF8F6F] cursor-pointer transition-colors duration-200 ${
                  formData.paymentMethod === 'upi' ? 'border-[#AF8F6F] bg-[#F0E9D8]' : 'border-[#E0D6C2] hover:bg-[#F0E9D8]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleChange}
                    className="text-[#AF8F6F] focus:ring-[#AF8F6F]"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-white border border-[#E0D6C2] rounded flex items-center justify-center">
                        <span className="text-xs font-light text-[#5A4738]">G</span>
                      </div>
                      <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                        <span className="text-xs font-light text-white">P</span>
                      </div>
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-xs font-light text-white">P</span>
                      </div>
                    </div>
                    <span className="font-light text-[#2C1810] tracking-wide">UPI Payment</span>
                  </div>
                </label>

                {formData.paymentMethod === 'upi' && (
                  <div className="ml-8 p-4 bg-[#F0E9D8] rounded-lg border border-[#E0D6C2]">
                    <label className="block text-sm font-light text-[#5A4738] mb-2 tracking-wide">
                      UPI ID *
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      placeholder="yourname@upi"
                      value={formData.upiId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B]"
                    />
                    <p className="text-sm text-[#5A4738] font-light mt-2">
                      You'll be redirected to your UPI app for payment
                    </p>
                  </div>
                )}

                {/* Cash on Delivery */}
                <label className={`flex items-center space-x-3 p-4 border rounded-lg hover:border-[#AF8F6F] cursor-pointer transition-colors duration-200 ${
                  formData.paymentMethod === 'cod' ? 'border-[#AF8F6F] bg-[#F0E9D8]' : 'border-[#E0D6C2] hover:bg-[#F0E9D8]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="text-[#AF8F6F] focus:ring-[#AF8F6F]"
                  />
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-[#5A4738]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                    <span className="font-light text-[#2C1810] tracking-wide">Cash on Delivery</span>
                  </div>
                </label>

                {formData.paymentMethod === 'cod' && (
                  <div className="ml-8 p-4 bg-[#F0E9D8] border border-[#E0D6C2] rounded-lg">
                    <p className="text-sm text-[#5A4738] font-light">
                      Pay when your order is delivered. Additional ₹50 cash handling charge applies.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-[#F8F4E1] rounded-xl shadow-lg p-6 border border-[#E0D6C2] sticky top-8">
              <h2 className="text-xl font-light text-[#2C1810] mb-4 tracking-wide">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-[#E0D6C2] last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-[#E0D6C2]"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100/F8F4E1/5A4738?text=Bag+Image';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-light text-[#2C1810] text-sm line-clamp-2 tracking-wide">{item.name}</p>
                      <p className="text-sm text-[#5A4738] font-light">Qty: {item.quantity}</p>
                      {item.category && (
                        <span className="inline-block bg-[#F0E9D8] text-[#AF8F6F] text-xs px-2 py-1 rounded mt-1 font-light">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="font-light text-[#2C1810] whitespace-nowrap tracking-wide">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-[#E0D6C2] pt-4">
                <div className="flex justify-between text-sm font-light">
                  <span className="text-[#5A4738]">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="text-[#2C1810]">₹{cartSummary.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-light">
                  <span className="text-[#5A4738]">Tax (10%)</span>
                  <span className="text-[#2C1810]">₹{cartSummary.tax}</span>
                </div>
                <div className="flex justify-between text-sm font-light">
                  <span className="text-[#5A4738]">Shipping</span>
                  <span className="text-[#AF8F6F]">Free</span>
                </div>
                {formData.paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm font-light">
                    <span className="text-[#5A4738]">Cash Handling Fee</span>
                    <span className="text-[#AF8F6F]">₹50</span>
                  </div>
                )}
                <div className="border-t border-[#E0D6C2] pt-3">
                  <div className="flex justify-between text-lg font-light">
                    <span className="text-[#2C1810] tracking-wide">Total</span>
                    <span className="text-[#2C1810] tracking-wide">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-[#AF8F6F] text-white py-4 px-6 rounded-lg font-light tracking-wide hover:bg-[#8B6F47] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </span>
                ) : (
                  `Place Order - ₹${calculateTotal()}`
                )}
              </button>

              <p className="text-xs text-[#5A4738] font-light text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>

            {/* Security Info */}
            <div className="bg-[#F8F4E1] rounded-xl shadow-lg p-6 border border-[#E0D6C2]">
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <svg className="w-8 h-8 text-[#AF8F6F] mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                  </svg>
                  <p className="text-xs text-[#5A4738] font-light">Secure Payment</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 text-[#AF8F6F] mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <p className="text-xs text-[#5A4738] font-light">Verified</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 text-[#AF8F6F] mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <p className="text-xs text-[#5A4738] font-light">Email Receipt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
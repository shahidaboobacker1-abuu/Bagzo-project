// Pages/CheckoutPage/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartProvider';
import { useAuth } from '../Context/AuthProvider';

function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart, addToOrderHistory } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'card'
  });

  // UPI payment states
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [upiVerificationCode, setUpiVerificationCode] = useState('');
  const [generatedVerificationCode, setGeneratedVerificationCode] = useState('');
  
  // Card payment states
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.1;
    const codFee = formData.paymentMethod === 'cod' ? 50 : 0;
    return (subtotal + tax + codFee).toFixed(2);
  };

  // Generate random order ID
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD${timestamp}${random}`;
  };

  // Generate random 6-digit verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Handle UPI payment
  const handleUPIPayment = () => {
    if (!upiId.trim()) {
      alert('Please enter your UPI ID');
      return;
    }

    // Validate UPI ID format (basic validation)
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId)) {
      alert('Please enter a valid UPI ID (e.g., username@okbank)');
      return;
    }

    // Generate and display verification code
    const code = generateVerificationCode();
    setGeneratedVerificationCode(code);
    alert(`UPI Payment Request Sent! Verification Code: ${code}\n\nPlease check your UPI app to complete the payment.`);
  };

  // Verify UPI payment
  const verifyUPIPayment = () => {
    if (!upiVerificationCode.trim()) {
      alert('Please enter the verification code');
      return;
    }

    if (upiVerificationCode === generatedVerificationCode) {
      setIsProcessing(true);
      setTimeout(() => {
        completeOrder('UPI Payment');
      }, 1500);
    } else {
      alert('Invalid verification code. Please try again.');
    }
  };

  // Handle Card payment
  const handleCardPayment = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails;
    
    // Basic validation
    if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardholderName.trim()) {
      alert('Please fill in all card details');
      return;
    }

    // Validate card number (basic 16-digit check)
    const cardRegex = /^[0-9]{16}$/;
    if (!cardRegex.test(cardNumber.replace(/\s/g, ''))) {
      alert('Please enter a valid 16-digit card number');
      return;
    }

    // Validate expiry date (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) {
      alert('Please enter expiry date in MM/YY format');
      return;
    }

    // Validate CVV (3 or 4 digits)
    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(cvv)) {
      alert('Please enter a valid CVV (3 or 4 digits)');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      completeOrder('Credit/Debit Card');
    }, 1500);
  };

  // Handle Cash on Delivery
  const handleCOD = () => {
    setIsProcessing(true);
    setTimeout(() => {
      completeOrder('Cash on Delivery');
    }, 1500);
  };

  // Complete order after successful payment
  const completeOrder = (paymentMethod) => {
    const orderData = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      items: cartItems,
      shippingAddress: formData,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'pending' : 'completed',
      total: parseFloat(calculateTotal()),
      status: paymentMethod === 'Cash on Delivery' ? 'pending' : 'confirmed'
    };

    // Add to order history
    addToOrderHistory(orderData);
    clearCart();
    setPaymentSuccess(true);
    setIsProcessing(false);

    // Navigate to success page
    setTimeout(() => {
      navigate('/order-success', { 
        state: { 
          orderId: orderData.id,
          total: calculateTotal(),
          paymentMethod: paymentMethod
        }
      });
    }, 1000);
  };

  // Main submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid Indian phone number');
      return;
    }

    // Validate pincode
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      alert('Please enter a valid 6-digit PIN code');
      return;
    }

    // Show payment modal based on selected method
    switch(formData.paymentMethod) {
      case 'upi':
        setShowUPIModal(true);
        setShowCardModal(false);
        break;
      case 'card':
        setShowCardModal(true);
        setShowUPIModal(false);
        break;
      case 'cod':
        handleCOD();
        break;
      default:
        break;
    }
  };

  if (cartItems.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F4E1]">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-[#F8F4E1] rounded-2xl shadow-lg p-8 text-center border border-[#E0D6C2]">
            <h2 className="text-2xl font-light text-[#2C1810] mb-4 tracking-wide">Cart Empty</h2>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#AF8F6F] text-white px-6 py-2 rounded-lg hover:bg-[#8B6F47] transition-colors duration-200 font-light tracking-wide"
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
      {/* Navigation Bar - Matching Banner Theme */}
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-2">
            <span className="text-[#AF8F6F] text-sm font-light tracking-wider uppercase">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light mb-4 leading-tight text-[#2C1810] tracking-wide">
            Complete Your Order
          </h1>
        </div>

        {/* Payment Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#F8F4E1] rounded-xl p-8 max-w-md mx-4 border border-[#E0D6C2]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AF8F6F] mx-auto mb-4"></div>
                <h3 className="text-lg font-light text-[#2C1810] mb-2 tracking-wide">Processing Payment</h3>
                <p className="text-[#5A4738] font-light">Please wait while we process your payment...</p>
              </div>
            </div>
          </div>
        )}

        {/* UPI Payment Modal */}
        {showUPIModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#F8F4E1] rounded-xl p-6 max-w-md w-full mx-4 border border-[#E0D6C2]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-light text-[#2C1810] tracking-wide">UPI Payment</h3>
                <button onClick={() => setShowUPIModal(false)} className="text-[#5A4738] hover:text-[#2C1810]">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-[#5A4738] mb-1 tracking-wide">UPI ID</label>
                  <input
                    type="text"
                    placeholder="username@okbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light"
                  />
                  <p className="text-xs text-[#5A4738] mt-1 font-light">Enter your UPI ID to receive payment request</p>
                </div>

                {generatedVerificationCode ? (
                  <div>
                    <label className="block text-sm font-light text-[#5A4738] mb-1 tracking-wide">Verification Code</label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={upiVerificationCode}
                      onChange={(e) => setUpiVerificationCode(e.target.value)}
                      maxLength="6"
                      className="w-full px-3 py-2 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-center text-lg tracking-widest text-[#2C1810]"
                    />
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={verifyUPIPayment}
                        className="flex-1 bg-[#AF8F6F] text-white py-2 rounded-lg font-light tracking-wide hover:bg-[#8B6F47] transition-colors duration-200"
                      >
                        Verify Payment
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedVerificationCode('');
                          setUpiVerificationCode('');
                          handleUPIPayment();
                        }}
                        className="flex-1 border border-[#AF8F6F] text-[#AF8F6F] py-2 rounded-lg font-light tracking-wide hover:bg-[#AF8F6F] hover:text-white transition-colors duration-200"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleUPIPayment}
                    className="w-full bg-[#AF8F6F] text-white py-3 rounded-lg font-light tracking-wide hover:bg-[#8B6F47] transition-colors duration-200"
                  >
                    Send Payment Request
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Card Payment Modal */}
        {showCardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#F8F4E1] rounded-xl p-6 max-w-md w-full mx-4 border border-[#E0D6C2]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-light text-[#2C1810] tracking-wide">Card Payment</h3>
                <button onClick={() => setShowCardModal(false)} className="text-[#5A4738] hover:text-[#2C1810]">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-[#5A4738] mb-1 tracking-wide">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.cardholderName}
                    onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-[#5A4738] mb-1 tracking-wide">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      let formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                      if (formatted.length > 19) formatted = formatted.substring(0, 19);
                      setCardDetails({...cardDetails, cardNumber: formatted});
                    }}
                    maxLength="19"
                    className="w-full px-3 py-2 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-[#5A4738] mb-1 tracking-wide">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        if (value.length > 5) value = value.substring(0, 5);
                        setCardDetails({...cardDetails, expiryDate: value});
                      }}
                      maxLength="5"
                      className="w-full px-3 py-2 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#5A4738] mb-1 tracking-wide">CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length > 4) return;
                        setCardDetails({...cardDetails, cvv: value});
                      }}
                      maxLength="4"
                      className="w-full px-3 py-2 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCardPayment}
                  className="w-full bg-[#AF8F6F] text-white py-3 rounded-lg font-light tracking-wide hover:bg-[#8B6F47] transition-colors duration-200"
                >
                  Pay ₹{calculateTotal()}
                </button>

                <div className="text-xs text-[#5A4738] text-center font-light">
                  <p>This is a simulation. No real payment will be processed.</p>
                  <p>For testing, use: Card: 4111 1111 1111 1111 | Exp: 12/25 | CVV: 123</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div className="bg-[#F8F4E1] rounded-xl p-6 border border-[#E0D6C2] shadow-sm">
              <h2 className="text-xl font-light text-[#2C1810] mb-4 tracking-wide">Delivery Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B] transition-colors duration-200"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B] transition-colors duration-200"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B] transition-colors duration-200"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B] transition-colors duration-200"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN Code"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-[#F8F4E1] text-[#2C1810] font-light placeholder-[#8B7D6B] transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F8F4E1] rounded-xl p-6 border border-[#E0D6C2] shadow-sm">
              <h2 className="text-xl font-light text-[#2C1810] mb-4 tracking-wide">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { value: 'upi', label: 'UPI Payment', icon: '📱' },
                  { value: 'cod', label: 'Cash on Delivery', icon: '💰' }
                ].map(method => (
                  <label key={method.value} className="flex items-center space-x-4 p-4 hover:bg-[#F0E9D8] rounded-lg transition-colors duration-200 cursor-pointer border border-[#E0D6C2]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                      className="text-[#AF8F6F] focus:ring-[#AF8F6F]"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <span className="capitalize text-[#2C1810] font-light tracking-wide">{method.label}</span>
                      {method.value === 'cod' && (
                        <p className="text-sm text-[#AF8F6F] font-light">₹50 cash handling fee applies</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-[#F8F4E1] rounded-xl p-6 border border-[#E0D6C2] shadow-sm sticky top-6">
              <h2 className="text-xl font-light text-[#2C1810] mb-4 tracking-wide">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-[#E0D6C2]">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-[#E0D6C2]"
                      />
                      <div>
                        <p className="font-light text-[#2C1810] tracking-wide">{item.name}</p>
                        <p className="text-sm text-[#5A4738] font-light">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-light text-[#2C1810] tracking-wide">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-[#E0D6C2] pt-4">
                <div className="flex justify-between text-sm text-[#2C1810] font-light">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm text-[#2C1810] font-light">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(getTotalPrice() * 0.1)}</span>
                </div>
                {formData.paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm text-[#AF8F6F] font-light">
                    <span>Cash Handling Fee</span>
                    <span>₹50</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#E0D6C2] pt-3 text-[#2C1810] text-lg font-light tracking-wide">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-[#AF8F6F] text-white py-3 rounded-lg font-light tracking-wide hover:bg-[#8B6F47] transition-colors duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formData.paymentMethod === 'cod' ? 
                  'Place Order (Cash on Delivery)' : 
                  `Pay ₹${calculateTotal()}`
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
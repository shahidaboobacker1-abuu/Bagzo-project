// Pages/OrderSuccess/OrderSuccess.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total, paymentMethod } = location.state || {};

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    if (!price) return '₹0';
    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-2">
            <span className="text-[#AF8F6F] text-sm font-light tracking-wider uppercase">
              Order Confirmation
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light mb-4 leading-tight text-[#2C1810] tracking-wide">
            Thank You For Your Order
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-[#F8F4E1] rounded-2xl shadow-lg p-8 md:p-10 text-center border border-[#E0D6C2]">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-[#F0E9D8] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#AF8F6F]">
              <svg 
                className="w-10 h-10 text-[#AF8F6F]" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-light text-[#2C1810] mb-3 tracking-wide">Order Successful!</h1>
            <p className="text-[#5A4738] font-light mb-8 leading-relaxed">
              Thank you for your purchase. Your order has been confirmed and is being processed.
            </p>

            {/* Order Details */}
            <div className="bg-[#F0E9D8] rounded-xl p-6 mb-8 border border-[#E0D6C2]">
              <div className="mb-4">
                <p className="text-sm font-light text-[#5A4738] mb-1 tracking-wide">Order ID</p>
                <p className="text-lg font-light text-[#2C1810] tracking-wide">
                  {orderId || 'BAGZO' + Math.floor(Math.random() * 1000000)}
                </p>
              </div>
              
              {paymentMethod && (
                <div className="mb-4">
                  <p className="text-sm font-light text-[#5A4738] mb-1 tracking-wide">Payment Method</p>
                  <p className="text-base font-light text-[#2C1810] tracking-wide capitalize">
                    {paymentMethod}
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t border-[#E0D6C2]">
                <p className="text-sm font-light text-[#5A4738] mb-1 tracking-wide">Total Amount</p>
                <p className="text-2xl font-light text-[#AF8F6F] tracking-wide">
                  {formatPrice(total)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button
                onClick={() => navigate('/products')}
                className="bg-[#AF8F6F] text-white px-8 py-3 rounded-lg font-light tracking-wide hover:bg-[#8B6F47] transition-colors duration-200 min-w-[200px]"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/')}
                className="border border-[#E0D6C2] text-[#2C1810] px-8 py-3 rounded-lg font-light tracking-wide hover:border-[#AF8F6F] hover:text-[#AF8F6F] transition-colors duration-200 min-w-[200px]"
              >
                Go Home
              </button>
            </div>

            {/* Next Steps Information */}
            <div className="mt-8 p-6 bg-[#F0E9D8]/50 rounded-xl border border-[#E0D6C2]">
              <h3 className="text-lg font-light text-[#2C1810] mb-3 tracking-wide text-center">
                What's Next?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#AF8F6F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <p className="text-sm text-[#5A4738] font-light text-left">
                    <span className="font-medium text-[#2C1810]">Order Confirmation:</span> You will receive an email confirmation shortly with your order details.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#AF8F6F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">2</span>
                  </div>
                  <p className="text-sm text-[#5A4738] font-light text-left">
                    <span className="font-medium text-[#2C1810]">Processing:</span> Our team is preparing your items for shipment.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#AF8F6F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">3</span>
                  </div>
                  <p className="text-sm text-[#5A4738] font-light text-left">
                    <span className="font-medium text-[#2C1810]">Shipping:</span> You'll receive tracking information once your order ships.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#E0D6C2] text-center">
                <p className="text-sm text-[#5A4738] font-light">
                  Need help? Contact our customer support at{' '}
                  <a href="mailto:support@bagcollection.com" className="text-[#AF8F6F] hover:underline">
                    support@bagcollection.com
                  </a>
                </p>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="mt-8 pt-6 border-t border-[#E0D6C2]">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-[#AF8F6F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                <p className="text-sm font-light text-[#2C1810] tracking-wide">Estimated Delivery</p>
              </div>
              <p className="text-[#5A4738] font-light">
                5-7 business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { api } from '../API/Axios';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated, user]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      
      // Check if order belongs to current user
      if (response.data.userId === user.id || response.data.shippingAddress?.email === user.email) {
        setOrder(response.data);
      } else {
        alert('You are not authorized to view this order');
        navigate('/orders');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  // Format price in Indian Rupees
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-[#F8F4E1] text-[#5A4738] border border-[#E0D6C2]';
    }
  };

  // Calculate total items
  const getTotalItems = () => {
    return order?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  };

  // If user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F4E1]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-[#E0D6C2]">
            <h2 className="text-3xl font-light text-[#2C1810] mb-6 tracking-wide">LOGIN REQUIRED</h2>
            <div className="w-16 h-0.5 bg-[#AF8F6F] mx-auto mb-8"></div>
            <p className="text-[#5A4738] mb-8 font-light">Please login to view order details.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#2C1810] text-white px-8 py-4 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
            >
              SIGN IN
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4E1]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-[#AF8F6F] mx-auto mb-6"></div>
              <p className="text-[#2C1810] font-light tracking-wide">LOADING ORDER DETAILS...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F4E1]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-[#E0D6C2]">
            <h2 className="text-3xl font-light text-[#2C1810] mb-6 tracking-wide">ORDER NOT FOUND</h2>
            <div className="w-20 h-0.5 bg-[#AF8F6F] mx-auto mb-8"></div>
            <p className="text-[#5A4738] mb-8 font-light">The order you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-[#2C1810] text-white px-8 py-4 rounded-full font-light hover:bg-[#AF8F6F] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl tracking-wide"
            >
              BACK TO ORDERS
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4E1]">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-3 text-sm text-[#5A4738] font-light">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-[#AF8F6F] transition-colors duration-300"
            >
              HOME
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate('/orders')}
              className="hover:text-[#AF8F6F] transition-colors duration-300"
            >
              MY ORDERS
            </button>
            <span>/</span>
            <span className="text-[#AF8F6F] font-light tracking-wide">ORDER #{order.id}</span>
          </nav>
        </div>

        <div className="space-y-8">
          {/* Order Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E0D6C2]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-light text-[#2C1810] mb-3 tracking-wide">ORDER #{order.id}</h1>
                <div className="w-24 h-0.5 bg-[#AF8F6F] mb-4"></div>
                <p className="text-[#5A4738] font-light">
                  PLACED ON {formatDate(order.date).toUpperCase()}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className={`px-6 py-3 rounded-full text-sm font-light tracking-wide ${getStatusColor(order.status)}`}>
                  {order.status?.toUpperCase() || 'PROCESSING'}
                </span>
                <button
                  onClick={() => navigate('/orders')}
                  className="border border-[#E0D6C2] text-[#2C1810] hover:border-[#AF8F6F] hover:text-[#AF8F6F] px-6 py-3 rounded-full transition-all duration-300 font-light tracking-wide hover:scale-105"
                >
                  BACK TO ORDERS
                </button>
              </div>
            </div>

            {/* Order Progress */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="text-sm text-[#5A4738] font-light">
                  ESTIMATED DELIVERY: {order.status === 'delivered' ? 'DELIVERED' : 'WITHIN 3-5 BUSINESS DAYS'}
                </div>
                <div className="text-sm font-light text-[#2C1810] tracking-wide">
                  {getTotalItems()} ITEM{getTotalItems() !== 1 ? 'S' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E0D6C2]">
            <h2 className="text-2xl font-light text-[#2C1810] mb-6 tracking-wide">ORDER ITEMS</h2>
            <div className="space-y-6">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-6 p-6 border border-[#E0D6C2] rounded-xl hover:border-[#AF8F6F]/30 transition-all duration-300">
                  <div className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl border border-[#E0D6C2]"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150/F8F4E1/2C1810?text=BagZo+Luxury';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-light text-lg text-[#2C1810] mb-2 tracking-wide">{item.name}</h3>
                    {item.category && (
                      <p className="text-sm text-[#AF8F6F] mb-2 font-light tracking-wide">{item.category.toUpperCase()}</p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-[#5A4738] font-light">
                      <span>QTY: {item.quantity || 1}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{formatPrice(item.price)} EACH</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-light text-[#2C1810]">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-sm text-[#AF8F6F] line-through font-light">
                        {formatPrice(item.originalPrice * (item.quantity || 1))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary and Shipping Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E0D6C2]">
              <h2 className="text-2xl font-light text-[#2C1810] mb-6 tracking-wide">SHIPPING INFORMATION</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#5A4738] font-light tracking-wide mb-2">RECIPIENT</p>
                  <p className="font-light text-lg text-[#2C1810] tracking-wide">
                    {order.shippingAddress?.name || user.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#5A4738] font-light tracking-wide mb-2">ADDRESS</p>
                  <p className="font-light text-lg text-[#2C1810] tracking-wide">
                    {order.shippingAddress?.address || 'N/A'}
                  </p>
                  <p className="text-sm text-[#5A4738] font-light mt-1">
                    {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#5A4738] font-light tracking-wide mb-2">CONTACT</p>
                  <p className="font-light text-lg text-[#2C1810] tracking-wide">
                    {order.shippingAddress?.phone || 'N/A'}
                  </p>
                  <p className="text-sm text-[#5A4738] font-light mt-1">
                    {order.shippingAddress?.email || user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E0D6C2]">
              <h2 className="text-2xl font-light text-[#2C1810] mb-6 tracking-wide">ORDER SUMMARY</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-[#5A4738] font-light">SUBTOTAL</span>
                  <span className="text-[#2C1810] font-light">
                    {formatPrice(order.total || order.finalTotal || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A4738] font-light">SHIPPING</span>
                  <span className="text-green-600 font-light">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A4738] font-light">TAX (10%)</span>
                  <span className="text-[#2C1810] font-light">
                    {formatPrice((order.total || 0) * 0.1)}
                  </span>
                </div>
                <div className="border-t border-[#E0D6C2] pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="text-[#2C1810] font-light">TOTAL</span>
                    <span className="text-[#2C1810] font-light">
                      {formatPrice(order.finalTotal || order.total || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#E0D6C2]">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#5A4738] font-light">PAYMENT METHOD</span>
                    <span className="text-[#2C1810] font-light">
                      {order.paymentMethod?.toUpperCase() || 'NOT SPECIFIED'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5A4738] font-light">PAYMENT STATUS</span>
                    <span className={`px-4 py-2 rounded-full text-xs font-light tracking-wide ${
                      order.paymentStatus === 'completed' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {order.paymentStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E0D6C2]">
            <div className="flex flex-col sm:flex-row gap-6 justify-between">
              <button
                onClick={() => navigate('/products')}
                className="border-2 border-[#2C1810] text-[#2C1810] hover:border-[#AF8F6F] hover:text-[#AF8F6F] px-8 py-4 rounded-full transition-all duration-300 font-light tracking-wide hover:scale-105"
              >
                CONTINUE SHOPPING
              </button>
              <button
                onClick={() => window.print()}
                className="border-2 border-[#E0D6C2] text-[#2C1810] hover:border-[#AF8F6F] hover:text-[#AF8F6F] px-8 py-4 rounded-full transition-all duration-300 font-light tracking-wide hover:scale-105"
              >
                PRINT INVOICE
              </button>
              {order.status === 'delivered' && (
                <button
                  onClick={() => alert('Thank you for your purchase! We appreciate your feedback.')}
                  className="bg-[#2C1810] hover:bg-[#AF8F6F] text-white px-8 py-4 rounded-full transition-all duration-300 font-light tracking-wide transform hover:-translate-y-1 hover:shadow-xl"
                >
                  LEAVE REVIEW
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderDetails;
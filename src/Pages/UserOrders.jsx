import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { api } from '../API/Axios';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserOrders();
    }
  }, [isAuthenticated, user]);

  // Fetch user's orders
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      const userOrders = response.data.filter(order => 
        order.userId === user.id || order.shippingAddress?.email === user.email
      );
      
      // Sort by date (newest first)
      userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setOrders(userOrders);
      setFilteredOrders(userOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Filter and search orders
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Search by order ID or product name
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const orderIdMatch = order.id?.toLowerCase().includes(searchLower);
        const productNameMatch = order.items?.some(item => 
          item.name?.toLowerCase().includes(searchLower)
        );
        return orderIdMatch || productNameMatch;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, selectedStatus, searchTerm]);

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
      day: '2-digit',
      month: 'short',
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

  // Handle order click
  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Calculate total items in order
  const getTotalItems = (order) => {
    return order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
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
            <p className="text-[#5A4738] mb-8 font-light">Please login to view your orders.</p>
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

  return (
    <div className="min-h-screen bg-[#F8F4E1]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-[#2C1810] mb-4 tracking-wide">MY ORDERS</h1>
          <div className="w-24 h-0.5 bg-[#AF8F6F] mb-6"></div>
          <p className="text-lg text-[#5A4738] font-light">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-[#E0D6C2]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-light text-[#5A4738] mb-3 tracking-wide">
                SEARCH ORDERS
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by order ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 border border-[#E0D6C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-white text-[#2C1810] placeholder-[#AF8F6F]/50 transition-all duration-300"
                />
                <svg className="absolute right-4 top-4 w-5 h-5 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-light text-[#5A4738] mb-3 tracking-wide">
                FILTER BY STATUS
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-6 py-4 border border-[#E0D6C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-white text-[#2C1810] transition-all duration-300"
              >
                <option value="all">ALL ORDERS</option>
                <option value="pending">PENDING</option>
                <option value="confirmed">CONFIRMED</option>
                <option value="shipped">SHIPPED</option>
                <option value="delivered">DELIVERED</option>
                <option value="cancelled">CANCELLED</option>
              </select>
            </div>


          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-[#AF8F6F] mx-auto mb-6"></div>
              <p className="text-[#2C1810] font-light tracking-wide">LOADING YOUR ORDERS...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Orders Grid */}
            <div className="space-y-8">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-[#E0D6C2]">
                  <div className="w-28 h-28 mx-auto mb-8 text-[#AF8F6F]">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-light text-[#2C1810] mb-6 tracking-wide">NO ORDERS FOUND</h3>
                  <div className="w-20 h-0.5 bg-[#AF8F6F] mx-auto mb-8"></div>
                  <p className="text-[#5A4738] mb-12 max-w-md mx-auto font-light leading-relaxed">
                    {searchTerm || selectedStatus !== 'all' 
                      ? 'Try adjusting your search or filter to find what you\'re looking for.'
                      : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'
                    }
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('all');
                      navigate('/products');
                    }}
                    className="bg-[#2C1810] hover:bg-[#AF8F6F] text-white px-10 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl font-light tracking-wide"
                  >
                    START SHOPPING
                  </button>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-2xl shadow-xl border border-[#E0D6C2] hover:shadow-2xl hover:border-[#AF8F6F]/30 transition-all duration-500 cursor-pointer"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    {/* Order Header */}
                    <div className="p-8 border-b border-[#E0D6C2]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                            <h3 className="text-2xl font-light text-[#2C1810] tracking-wide">ORDER #{order.id}</h3>
                            <span className={`px-4 py-2 rounded-full text-sm font-light tracking-wide ${getStatusColor(order.status)}`}>
                              {order.status?.toUpperCase() || 'PROCESSING'}
                            </span>
                          </div>
                          <p className="text-sm text-[#5A4738] font-light">
                            PLACED ON {formatDate(order.date).toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-light text-[#2C1810]">
                            {formatPrice(order.total || order.finalTotal || 0)}
                          </p>
                          <p className="text-sm text-[#AF8F6F] font-light tracking-wide">
                            {getTotalItems(order)} ITEM{getTotalItems(order) !== 1 ? 'S' : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-8">
                      <div className="space-y-6">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center space-x-6">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-xl border border-[#E0D6C2]"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150x150/F8F4E1/2C1810?text=BagZo+Luxury';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-light text-lg text-[#2C1810] truncate tracking-wide">{item.name}</h4>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-[#5A4738] font-light mt-1">
                                <span>QTY: {item.quantity || 1}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{formatPrice(item.price)} EACH</span>
                              </div>
                              {item.category && (
                                <span className="inline-block bg-[#F8F4E1] text-[#AF8F6F] text-xs px-3 py-1.5 rounded-full mt-2 font-light tracking-wide">
                                  {item.category.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="font-light text-xl text-[#2C1810]">
                              {formatPrice((item.price || 0) * (item.quantity || 1))}
                            </div>
                          </div>
                        ))}

                        {/* Show more items indicator */}
                        {order.items && order.items.length > 2 && (
                          <div className="pt-6 border-t border-[#E0D6C2] text-center">
                            <p className="text-sm text-[#AF8F6F] font-light tracking-wide">
                              + {order.items.length - 2} MORE ITEM{order.items.length - 2 !== 1 ? 'S' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="px-8 py-6 bg-[#F8F4E1] rounded-b-2xl">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-sm text-[#2C1810] font-light">
                          <span className="tracking-wide">PAYMENT: </span>
                          {order.paymentMethod?.toUpperCase() || 'NOT SPECIFIED'}
                          {order.paymentStatus && (
                            <span className={`ml-3 px-3 py-1.5 rounded-full text-xs font-light tracking-wide ${
                              order.paymentStatus === 'completed' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {order.paymentStatus.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order.id);
                          }}
                          className="border-2 border-[#2C1810] text-[#2C1810] hover:border-[#AF8F6F] hover:text-[#AF8F6F] px-6 py-3 rounded-full transition-all duration-300 font-light tracking-wide hover:scale-105"
                        >
                          VIEW DETAILS
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Orders Summary */}
            {filteredOrders.length > 0 && (
              <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-[#E0D6C2]">
                <h3 className="text-2xl font-light text-[#2C1810] mb-8 tracking-wide text-center">ORDERS SUMMARY</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 border border-[#E0D6C2] rounded-xl hover:border-[#AF8F6F] transition-all duration-300">
                    <div className="text-3xl font-light text-[#2C1810]">
                      {orders.length}
                    </div>
                    <div className="text-sm text-[#5A4738] font-light tracking-wide mt-2">TOTAL ORDERS</div>
                  </div>
                  <div className="text-center p-6 border border-[#E0D6C2] rounded-xl hover:border-[#AF8F6F] transition-all duration-300">
                    <div className="text-3xl font-light text-green-600">
                      {orders.filter(o => o.status === 'delivered').length}
                    </div>
                    <div className="text-sm text-[#5A4738] font-light tracking-wide mt-2">DELIVERED</div>
                  </div>
                  <div className="text-center p-6 border border-[#E0D6C2] rounded-xl hover:border-[#AF8F6F] transition-all duration-300">
                    <div className="text-3xl font-light text-blue-600">
                      {orders.filter(o => o.status === 'shipped').length}
                    </div>
                    <div className="text-sm text-[#5A4738] font-light tracking-wide mt-2">SHIPPED</div>
                  </div>
                  <div className="text-center p-6 border border-[#E0D6C2] rounded-xl hover:border-[#AF8F6F] transition-all duration-300">
                    <div className="text-3xl font-light text-orange-600">
                      {orders.filter(o => o.status === 'pending').length}
                    </div>
                    <div className="text-sm text-[#5A4738] font-light tracking-wide mt-2">PENDING</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default UserOrders;
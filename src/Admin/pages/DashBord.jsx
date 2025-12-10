import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../API/Axios';

function DashboardOverview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    popularProducts: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/users'),
        api.get('/orders')
      ]);

      const products = productsRes.data || [];
      const users = usersRes.data || [];
      const orders = ordersRes.data || [];

      // Calculate revenue
      const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      // Get recent orders (last 5)
      const recentOrders = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      // Get popular products
      const productSales = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          productSales[item.productId || item.id] = 
            (productSales[item.productId || item.id] || 0) + (item.quantity || 1);
        });
      });

      const popularProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([productId, sales]) => {
          const product = products.find(p => p.id === productId || p._id === productId);
          return {
            ...product,
            sales
          };
        });

      // Calculate user growth
      const userGrowth = calculateUserGrowth(users, timeRange);

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        recentOrders,
        popularProducts,
        userGrowth
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const calculateUserGrowth = (users, range) => {
    const now = new Date();
    let startDate;
    
    switch(range) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const newUsers = users.filter(user => 
      new Date(user.createdAt || user.date) >= startDate
    );
    
    return {
      count: newUsers.length,
      percentage: users.length > 0 ? ((newUsers.length / users.length) * 100).toFixed(1) : 0
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AF8F6F] mx-auto mb-4"></div>
          <p className="text-[#5A4738] font-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4E1] p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="mb-1">
              <span className="text-[#AF8F6F] text-sm font-medium tracking-wider uppercase">
                Dashboard Overview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-light text-[#2C1810] tracking-wide">
              Welcome back! Here's what's happening with your store.
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-[#E0D6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] bg-white text-[#2C1810] font-light"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Products Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E0D6C2] hover:border-[#AF8F6F] transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A4738] font-light mb-1">Total Products</p>
                <h3 className="text-2xl font-light text-[#2C1810] tracking-wide">{stats.totalProducts}</h3>
              </div>
              <div className="p-3 bg-[#F8F4E1] rounded-lg border border-[#E0D6C2]">
                <svg className="w-6 h-6 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="mt-4 text-sm text-[#AF8F6F] hover:text-[#8B6F47] font-light tracking-wide flex items-center group"
            >
              View Products
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Total Users Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E0D6C2] hover:border-[#AF8F6F] transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A4738] font-light mb-1">Total Users</p>
                <h3 className="text-2xl font-light text-[#2C1810] tracking-wide">{stats.totalUsers}</h3>
                <p className="text-xs text-[#AF8F6F] mt-1 font-light">
                  +{stats.userGrowth.count} new ({stats.userGrowth.percentage}%)
                </p>
              </div>
              <div className="p-3 bg-[#F8F4E1] rounded-lg border border-[#E0D6C2]">
                <svg className="w-6 h-6 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10 10 0 01-.67 3.623m0 0a10 10 0 01-13.67-3.623m13.67 0a10 10 0 00-13.67 3.623" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/users')}
              className="mt-4 text-sm text-[#AF8F6F] hover:text-[#8B6F47] font-light tracking-wide flex items-center group"
            >
              View Users
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E0D6C2] hover:border-[#AF8F6F] transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A4738] font-light mb-1">Total Orders</p>
                <h3 className="text-2xl font-light text-[#2C1810] tracking-wide">{stats.totalOrders}</h3>
              </div>
              <div className="p-3 bg-[#F8F4E1] rounded-lg border border-[#E0D6C2]">
                <svg className="w-6 h-6 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="mt-4 text-sm text-[#AF8F6F] hover:text-[#8B6F47] font-light tracking-wide flex items-center group"
            >
              View Orders
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E0D6C2] hover:border-[#AF8F6F] transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A4738] font-light mb-1">Total Revenue</p>
                <h3 className="text-2xl font-light text-[#2C1810] tracking-wide">{formatPrice(stats.totalRevenue)}</h3>
              </div>
              <div className="p-3 bg-[#F8F4E1] rounded-lg border border-[#E0D6C2]">
                <svg className="w-6 h-6 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="mt-4 text-sm text-[#AF8F6F] hover:text-[#8B6F47] font-light tracking-wide flex items-center group"
            >
              View Revenue
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Recent Orders & Popular Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E0D6C2]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-[#AF8F6F] font-light tracking-wider mb-1">Recent Orders</div>
                <h2 className="text-xl font-light text-[#2C1810] tracking-wide">Latest Transactions</h2>
              </div>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-sm text-[#AF8F6F] hover:text-[#8B6F47] font-light tracking-wide flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E0D6C2]">
                    <th className="text-left py-3 text-sm text-[#5A4738] font-light tracking-wide">Order ID</th>
                    <th className="text-left py-3 text-sm text-[#5A4738] font-light tracking-wide">Customer</th>
                    <th className="text-left py-3 text-sm text-[#5A4738] font-light tracking-wide">Date</th>
                    <th className="text-left py-3 text-sm text-[#5A4738] font-light tracking-wide">Amount</th>
                    <th className="text-left py-3 text-sm text-[#5A4738] font-light tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#E0D6C2]/50 hover:bg-[#F8F4E1] transition-colors duration-200">
                      <td className="py-3">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="text-sm text-[#AF8F6F] hover:text-[#8B6F47] font-light"
                        >
                          #{order.id?.slice(0, 8) || 'ORD' + order.id?.substring(0, 4) || 'N/A'}
                        </button>
                      </td>
                      <td className="py-3 text-sm text-[#2C1810] font-light">
                        {order.shippingAddress?.name || 'N/A'}
                      </td>
                      <td className="py-3 text-sm text-[#5A4738] font-light">
                        {formatDate(order.date || new Date())}
                      </td>
                      <td className="py-3 text-sm font-light text-[#2C1810]">
                        {formatPrice(order.total || 0)}
                      </td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wide ${
                          order.status === 'delivered' ? 'bg-[#F8F4E1] text-[#AF8F6F] border border-[#E0D6C2]' :
                          order.status === 'pending' ? 'bg-[#F8F4E1] text-[#AF8F6F] border border-[#E0D6C2]' :
                          order.status === 'cancelled' ? 'bg-[#F8F4E1] text-[#AF8F6F] border border-[#E0D6C2]' :
                          'bg-[#F8F4E1] text-[#AF8F6F] border border-[#E0D6C2]'
                        }`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Processing'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Popular Products */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E0D6C2]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-[#AF8F6F] font-light tracking-wider mb-1">Popular Products</div>
                <h2 className="text-xl font-light text-[#2C1810] tracking-wide">Top Selling Items</h2>
              </div>
              <button
                onClick={() => navigate('/admin/products')}
                className="text-sm text-[#AF8F6F] hover:text-[#8B6F47] font-light tracking-wide flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {stats.popularProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 hover:bg-[#F8F4E1] rounded-lg border border-[#E0D6C2] transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-light text-[#AF8F6F] w-6">{index + 1}</span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded border border-[#E0D6C2]"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40x40/F8F4E1/5A4738?text=Bag';
                      }}
                    />
                    <div>
                      <h4 className="text-sm font-light text-[#2C1810] tracking-wide">{product.name || 'Product Name'}</h4>
                      <p className="text-xs text-[#5A4738] font-light">{product.category || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light text-[#2C1810]">
                      {formatPrice(product.price || 0)}
                    </p>
                    <p className="text-xs text-[#5A4738] font-light">{product.sales || 0} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
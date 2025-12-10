import React, { useState, useEffect } from 'react';
import { api } from '../../API/Axios';
import AdminLayout from '../Component/AdminLayout';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(search) || 
                         order.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || order.status === status;
    return matchesSearch && matchesStatus;
  });

  // Status update
  const updateStatus = async (id, newStatus) => {
    try {
      const order = orders.find(o => o.id === id);
      await api.put(`/orders/${id}`, { ...order, status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    delivered: orders.filter(o => o.status === 'delivered').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  // Format helpers
  const formatPrice = (price) => `₹${(price || 0).toLocaleString('en-IN')}`;
  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-[#F8F4E1] flex justify-center items-center">
          <div style={{ color: '#5A4738', fontSize: '18px' }} className="font-light">Loading orders...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F8F4E1] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="mb-1">
              <span className="text-sm font-light tracking-wider uppercase" style={{ color: '#AF8F6F' }}>
                Order Management
              </span>
            </div>
            <h1 className="text-2xl font-light tracking-wide" style={{ color: '#2C1810' }}>
              Manage and Track Customer Orders
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="p-4 rounded-xl border shadow-sm transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light" style={{ color: '#5A4738' }}>Total Orders</div>
              <div className="text-2xl font-light tracking-wide" style={{ color: '#2C1810' }}>{stats.total}</div>
            </div>
            <div className="p-4 rounded-xl border shadow-sm transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light" style={{ color: '#5A4738' }}>Pending</div>
              <div className="text-2xl font-light tracking-wide" style={{ color: '#AF8F6F' }}>{stats.pending}</div>
            </div>
            <div className="p-4 rounded-xl border shadow-sm transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light" style={{ color: '#5A4738' }}>Confirmed</div>
              <div className="text-2xl font-light tracking-wide" style={{ color: '#AF8F6F' }}>{stats.confirmed}</div>
            </div>
            <div className="p-4 rounded-xl border shadow-sm transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light" style={{ color: '#5A4738' }}>Shipped</div>
              <div className="text-2xl font-light tracking-wide" style={{ color: '#AF8F6F' }}>{stats.shipped}</div>
            </div>
            <div className="p-4 rounded-xl border shadow-sm transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light" style={{ color: '#5A4738' }}>Delivered</div>
              <div className="text-2xl font-light tracking-wide" style={{ color: '#8B6F47' }}>{stats.delivered}</div>
            </div>
            <div className="p-4 rounded-xl border shadow-sm transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light" style={{ color: '#5A4738' }}>Revenue</div>
              <div className="text-2xl font-light tracking-wide" style={{ color: '#2C1810' }}>{formatPrice(stats.revenue)}</div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="rounded-xl border shadow-sm p-6 mb-8 bg-white border-[#E0D6C2]">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-light mb-2 tracking-wide" style={{ color: '#5A4738' }}>
                  Search Orders
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by order ID, customer name, email or phone..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none transition-colors duration-200 font-light placeholder-[#8B7D6B] bg-white border border-[#E0D6C2] text-[#2C1810]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <svg className="absolute left-4 top-3.5 h-5 w-5 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-xl border shadow-sm overflow-hidden bg-white border-[#E0D6C2]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F4E1]">
                    <th className="p-6 text-left text-sm font-light tracking-wide text-[#2C1810]">Order Details</th>
                    <th className="p-6 text-left text-sm font-light tracking-wide text-[#2C1810]">Customer</th>
                    <th className="p-6 text-left text-sm font-light tracking-wide text-[#2C1810]">Amount</th>
                    <th className="p-6 text-left text-sm font-light tracking-wide text-[#2C1810]">Status</th>
                    <th className="p-6 text-left text-sm font-light tracking-wide text-[#2C1810]">Update Status</th>
                    <th className="p-6 text-left text-sm font-light tracking-wide text-[#2C1810]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-t hover:bg-[#F8F4E1] transition-colors duration-200 border-[#E0D6C2]">
                      <td className="p-6">
                        <div className="font-light tracking-wide text-[#2C1810]">{order.id}</div>
                        <div className="text-sm font-light mt-1 text-[#5A4738]">{formatDate(order.date)}</div>
                        <div className="text-xs font-light mt-1 text-[#AF8F6F]">{order.items?.length || 0} items</div>
                      </td>
                      <td className="p-6">
                        <div className="font-light tracking-wide text-[#2C1810]">{order.shippingAddress?.name || 'N/A'}</div>
                        <div className="text-sm font-light mt-1 text-[#5A4738]">{order.shippingAddress?.email || 'N/A'}</div>
                        <div className="text-xs font-light mt-1 text-[#AF8F6F]">{order.shippingAddress?.phone || 'N/A'}</div>
                      </td>
                      <td className="p-6">
                        <div className="font-light tracking-wide text-[#2C1810]">{formatPrice(order.total)}</div>
                        <div className="text-sm font-light mt-1 capitalize text-[#5A4738]">{order.paymentMethod || 'N/A'}</div>
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-light tracking-wide border ${
                          order.status === 'delivered' ? 'bg-[#F8F4E1] text-[#8B6F47] border-[#E0D6C2]' :
                          order.status === 'shipped' ? 'bg-[#F8F4E1] text-[#AF8F6F] border-[#E0D6C2]' :
                          order.status === 'confirmed' ? 'bg-[#F8F4E1] text-[#AF8F6F] border-[#E0D6C2]' :
                          order.status === 'pending' ? 'bg-[#F8F4E1] text-[#AF8F6F] border-[#E0D6C2]' :
                          'bg-[#F8F4E1] text-[#AF8F6F] border-[#E0D6C2]'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="px-4 py-2 rounded-lg text-sm border transition-colors duration-200 w-full font-light bg-white text-[#2C1810] border-[#E0D6C2]"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-6">
                        <button 
                          onClick={() => updateStatus(order.id, getNextStatus(order.status))}
                          className="px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 flex items-center justify-center transition-colors duration-200 w-full font-light tracking-wide bg-[#2C1810]"
                          style={{ 
                            opacity: order.status === 'delivered' ? 0.6 : 1
                          }}
                          disabled={order.status === 'delivered'}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {getActionText(order.status)}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-16">
                  <svg className="w-20 h-20 mx-auto text-[#E0D6C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                  <h3 className="mt-6 text-lg font-light tracking-wide text-[#2C1810]">No orders found</h3>
                  <p className="mt-2 font-light text-[#5A4738]">
                    {search 
                      ? 'Try adjusting your search to find what you\'re looking for.'
                      : 'No orders have been placed yet.'}
                  </p>
                </div>
              )}
            </div>

            {/* Table Footer */}
            {filteredOrders.length > 0 && (
              <div className="px-8 py-6 border-t border-[#E0D6C2] bg-[#F8F4E1]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm font-light text-[#5A4738]">
                    Showing <span className="font-light tracking-wide text-[#2C1810]">{filteredOrders.length}</span> of{' '}
                    <span className="font-light tracking-wide text-[#2C1810]">{orders.length}</span> orders
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Additional Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border bg-white border-[#E0D6C2]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-light text-[#5A4738]">Average Order Value</div>
                  <div className="text-2xl font-light tracking-wide mt-1 text-[#2C1810]">
                    {stats.total > 0 ? formatPrice(stats.revenue / stats.total) : '₹0'}
                  </div>
                </div>
                <svg className="w-8 h-8 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="p-6 rounded-xl border bg-white border-[#E0D6C2]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-light text-[#5A4738]">Cancelled Orders</div>
                  <div className="text-2xl font-light tracking-wide mt-1 text-[#2C1810]">{stats.cancelled}</div>
                </div>
                <svg className="w-8 h-8 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="p-6 rounded-xl border bg-white border-[#E0D6C2]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-light text-[#5A4738]">Completion Rate</div>
                  <div className="text-2xl font-light tracking-wide mt-1 text-[#8B6F47]">
                    {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
                  </div>
                </div>
                <svg className="w-8 h-8 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Helper function to get next status action
const getNextStatus = (currentStatus) => {
  switch(currentStatus) {
    case 'pending':
      return 'confirmed';
    case 'confirmed':
      return 'shipped';
    case 'shipped':
      return 'delivered';
    case 'delivered':
      return 'delivered'; // No next status
    case 'cancelled':
      return 'pending'; // Restart from pending
    default:
      return 'confirmed';
  }
};

// Helper function to get action text
const getActionText = (currentStatus) => {
  switch(currentStatus) {
    case 'pending':
      return 'Confirm Order';
    case 'confirmed':
      return 'Mark as Shipped';
    case 'shipped':
      return 'Mark as Delivered';
    case 'delivered':
      return 'Already Delivered';
    case 'cancelled':
      return 'Reactivate Order';
    default:
      return 'Update Status';
  }
};

export default OrderManagement;
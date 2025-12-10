import React, { useState, useEffect } from 'react';
import { api } from '../../API/Axios';
import AdminLayout from '../Component/AdminLayout';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setLoading(false);
    }
  };

  // Toggle user active/block status
  const toggleUserStatus = async (userId, currentStatus) => {
    const isCurrentlyBlocked = currentStatus.isBlocked;
    const isCurrentlyActive = currentStatus.isActive;
    
    if (isCurrentlyBlocked) {
      // Unblock user
      if (!window.confirm('Are you sure you want to unblock this user?')) {
        return;
      }
      
      try {
        const updatedUser = {
          isActive: true,
          isBlocked: false
        };

        await api.patch(`/users/${userId}`, updatedUser);
        
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, ...updatedUser } : user
        ));
        
        alert('User has been unblocked successfully!');
      } catch (error) {
        console.error('Error updating user status:', error);
        alert('Failed to unblock user. Please try again.');
      }
    } else {
      // Block user
      if (!window.confirm('Are you sure you want to block this user? The user will not be able to login.')) {
        return;
      }
      
      try {
        const updatedUser = {
          isActive: false,
          isBlocked: true
        };

        await api.patch(`/users/${userId}`, updatedUser);
        
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, ...updatedUser } : user
        ));
        
        alert('User has been blocked successfully!');
      } catch (error) {
        console.error('Error updating user status:', error);
        alert('Failed to block user. Please try again.');
      }
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    // Filter by status
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = user.isActive && !user.isBlocked;
    } else if (statusFilter === 'blocked') {
      matchesStatus = user.isBlocked;
    } else if (statusFilter === 'inactive') {
      matchesStatus = !user.isActive && !user.isBlocked;
    }
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats - Updated to include blocked users
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role === 'user' || u.role === 'customer').length,
    active: users.filter(u => u.isActive && !u.isBlocked).length,
    blocked: users.filter(u => u.isBlocked).length,
    inactive: users.filter(u => !u.isActive && !u.isBlocked).length,
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-[#F8F4E1] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AF8F6F]"></div>
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
              <span className="text-sm font-light tracking-wider uppercase text-[#AF8F6F]">
                User Management
              </span>
            </div>
            <h1 className="text-2xl font-light tracking-wide text-[#2C1810]">
              Manage User Accounts and Permissions
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="rounded-xl border p-4 transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light text-[#5A4738]">Total Users</div>
              <div className="text-2xl font-light tracking-wide mt-1 text-[#2C1810]">{stats.total}</div>
            </div>
            <div className="rounded-xl border p-4 transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light text-[#5A4738]">Admins</div>
              <div className="text-2xl font-light tracking-wide mt-1 text-[#AF8F6F]">{stats.admins}</div>
            </div>
            <div className="rounded-xl border p-4 transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light text-[#5A4738]">Customers</div>
              <div className="text-2xl font-light tracking-wide mt-1 text-[#AF8F6F]">{stats.customers}</div>
            </div>
            <div className="rounded-xl border p-4 transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light text-[#5A4738]">Active</div>
              <div className="text-2xl font-light tracking-wide mt-1 text-[#8B6F47]">{stats.active}</div>
            </div>
            <div className="rounded-xl border p-4 transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light text-[#5A4738]">Blocked</div>
              <div className="text-2xl font-light tracking-wide mt-1 text-[#C84E3F]">{stats.blocked}</div>
            </div>
            <div className="rounded-xl border p-4 transition-colors duration-200 hover:border-[#AF8F6F] bg-white border-[#E0D6C2]">
              <div className="text-sm font-light text-[#5A4738]">Inactive</div>
              <div className="text-2xl font-light tracking-wide mt-1 text-[#D49C6A]">{stats.inactive}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-xl border p-6 mb-8 bg-white border-[#E0D6C2]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-light tracking-wide mb-2 text-[#5A4738]">
                  Search Users
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-3 border rounded-lg focus:ring-3 focus:outline-none transition-colors duration-200 font-light placeholder-[#8B7D6B] bg-white border-[#E0D6C2] text-[#2C1810]"
                  />
                  <svg className="absolute right-4 top-3.5 w-5 h-5 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-light tracking-wide mb-2 text-[#5A4738]">
                  Filter by Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-200 font-light bg-white border-[#E0D6C2] text-[#2C1810]"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">Customer</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-light tracking-wide mb-2 text-[#5A4738]">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-200 font-light bg-white border-[#E0D6C2] text-[#2C1810]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-xl border overflow-hidden bg-white border-[#E0D6C2]">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#F8F4E1]">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      User
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Contact Info
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Role
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Joined Date
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-light tracking-wide text-[#2C1810]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0D6C2]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#F8F4E1] transition-colors duration-200">
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#AF8F6F]">
                            <span className="text-white font-light text-lg">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-light tracking-wide text-[#2C1810]">{user.name}</div>
                            <div className="text-xs font-light mt-1 text-[#5A4738]">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-light text-[#2C1810]">{user.email}</div>
                        <div className="text-sm font-light mt-1 text-[#5A4738]">{user.phone || 'No phone number'}</div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`px-4 py-2 rounded-full text-sm font-light tracking-wide border ${
                          user.role === 'admin' ? 'bg-[#F8F4E1] text-[#AF8F6F] border-[#E0D6C2]' : 'bg-[#F8F4E1] text-[#AF8F6F] border-[#E0D6C2]'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`px-4 py-2 rounded-full text-sm font-light tracking-wide border ${
                          user.isBlocked 
                            ? 'bg-[#F8F4E1] text-[#C84E3F] border-[#E0D6C2]' 
                            : user.isActive 
                              ? 'bg-[#F8F4E1] text-[#8B6F47] border-[#E0D6C2]'
                              : 'bg-[#F8F4E1] text-[#D49C6A] border-[#E0D6C2]'
                        }`}>
                          {user.isBlocked ? 'Blocked' : user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-light text-[#5A4738]">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <button
                          onClick={() => toggleUserStatus(user.id, { isActive: user.isActive, isBlocked: user.isBlocked })}
                          className={`px-4 py-2 rounded-lg font-light tracking-wide transition-colors duration-200 ${
                            user.isBlocked 
                              ? 'bg-[#F8F4E1] text-[#8B6F47] hover:bg-[#F0E9D8] border border-[#E0D6C2]' 
                              : 'bg-[#F8F4E1] text-[#C84E3F] hover:bg-[#F0E9D8] border border-[#E0D6C2]'
                          }`}
                        >
                          {user.isBlocked ? 'Unblock User' : 'Block User'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-20 h-20 mx-auto text-[#E0D6C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.663 0-1.313.103-1.933.297" />
                </svg>
                <h3 className="mt-6 text-lg font-light tracking-wide text-[#2C1810]">No users found</h3>
                <p className="mt-2 font-light text-[#5A4738]">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter to find what you\'re looking for.'
                    : 'No users found in the system.'}
                </p>
              </div>
            )}

            {/* Table Footer */}
            <div className="border-t border-[#E0D6C2] px-8 py-6 bg-[#F8F4E1]">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm font-light text-[#5A4738]">
                  Showing <span className="font-light tracking-wide text-[#2C1810]">{filteredUsers.length}</span> of{' '}
                  <span className="font-light tracking-wide text-[#2C1810]">{users.length}</span> users
                </p>
                <button
                  onClick={fetchUsers}
                  className="text-sm hover:opacity-90 font-light tracking-wide transition-colors duration-200 text-[#AF8F6F]"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* User Activity Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-6 bg-white border-[#E0D6C2]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light tracking-wide text-[#2C1810]">User Distribution</h3>
                <svg className="w-6 h-6 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#5A4738]">Admins</span>
                  <span className="text-sm font-light tracking-wide text-[#2C1810]">{stats.admins} users</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#5A4738]">Customers</span>
                  <span className="text-sm font-light tracking-wide text-[#2C1810]">{stats.customers} users</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#5A4738]">Active Users</span>
                  <span className="text-sm font-light tracking-wide text-[#2C1810]">{stats.active} users</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#5A4738]">Blocked Users</span>
                  <span className="text-sm font-light tracking-wide text-[#2C1810]">{stats.blocked} users</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-6 bg-white border-[#E0D6C2]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light tracking-wide text-[#2C1810]">Recent Activity</h3>
                <svg className="w-6 h-6 text-[#AF8F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3 bg-[#AF8F6F]"></div>
                  <span className="text-sm font-light text-[#5A4738]">Total users in system: {stats.total}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3 bg-[#8B6F47]"></div>
                  <span className="text-sm font-light text-[#5A4738]">Active rate: {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3 bg-[#C84E3F]"></div>
                  <span className="text-sm font-light text-[#5A4738]">Blocked rate: {stats.total > 0 ? Math.round((stats.blocked / stats.total) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
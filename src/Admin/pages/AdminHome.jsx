import React from 'react';
import AdminLayout from '../Component/AdminLayout';
import AdminDashboard from './DashBord';

export default function AdminHome() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
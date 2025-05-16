import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'owner') {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;

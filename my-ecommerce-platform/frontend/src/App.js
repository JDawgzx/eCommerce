import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AdminDashboard from './components/AdminDashboard';
import ProductList from './components/ProductList';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, login, logout, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'consumer') {
      (async () => {
        try {
          const res = await fetch('http://localhost:5000/api/products');
          if (!res.ok) throw new Error('Failed to fetch products');
          setProducts(await res.json());
        } catch (err) {
          setError(err.message);
        }
      })();
    }
  }, [user]);

  if (loading) {
    return <div className="container py-5"><p>Loading...</p></div>;
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              !user ? (
                <LoginForm
                  onLogin={({ email, password }) => {
                    fetch('http://localhost:5000/api/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, password }),
                    })
                      .then(r => r.json())
                      .then(data => login(data.user, data.token))
                      .catch(e => setError(e.message));
                  }}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !user ? (
                <RegisterForm
                  onRegister={({ name, email, password, role }) => {
                    fetch('http://localhost:5000/api/auth/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, email, password, role }),
                    })
                      .then(r => r.json())
                      .then(data => login(data.user, data.token))
                      .catch(e => setError(e.message));
                  }}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              user?.role === 'owner' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/"
            element={
              user ? (
                user.role === 'consumer' ? (
                  <>
                    <h1 className="text-center mb-4">Our Products</h1>
                    {error ? (
                      <div className="alert alert-danger text-center">{error}</div>
                    ) : products.length === 0 ? (
                      <div className="alert alert-warning text-center">No products available.</div>
                    ) : (
                      <ProductList products={products} />
                    )}
                  </>
                ) : (
                  <Navigate to="/admin" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Optional catch-all to redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

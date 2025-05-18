import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminProductManager = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState('');

  // Fetch products
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => setError('Failed to load products'));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new product
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to add product');
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setForm({ name: '', description: '', price: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Delete failed');
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Product Management</h2>

      <form onSubmit={handleAdd} className="mb-4">
        <input
          className="form-control mb-2"
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          className="form-control mb-2"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary" type="submit">Add Product</button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group">
        {products.map((product) => (
          <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{product.name}</strong> - ${product.price}
              <p>{product.description}</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductManager;

import React, { useEffect, useState, useCallback } from 'react';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    inStock: true,
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [editingId, setEditingId] = useState(null);
  const [editProductData, setEditProductData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const limit = 10;

  const fetchProducts = useCallback(() => {
    setLoading(true);
    let url = `http://localhost:5000/api/products?limit=${limit}&page=${page}&`;
    if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
    if (categoryFilter) url += `category=${encodeURIComponent(categoryFilter)}&`;
    if (priceFilter.min) url += `minPrice=${priceFilter.min}&`;
    if (priceFilter.max) url += `maxPrice=${priceFilter.max}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setPages(1);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
          setPages(data.pages || 1);
        } else {
          console.error('Unexpected response:', data);
          setProducts([]);
          setPages(1);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to load products.');
        setLoading(false);
      });
  }, [searchTerm, categoryFilter, priceFilter, page]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchProducts();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, categoryFilter, priceFilter, fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [page, fetchProducts]);

  const handleInputChange = (e, isEdit = false) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === 'checkbox' ? checked : files?.[0] || value;

    if (isEdit) {
      setEditProductData((prev) => ({ ...prev, [name]: val }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Name and price are required.');
      return;
    }

    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, val]) => {
      if (val !== null) formData.append(key, key === 'price' ? parseFloat(val) : val);
    });

    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        fetchProducts();
        setNewProduct({
          name: '',
          price: '',
          description: '',
          category: '',
          inStock: true,
          image: null,
        });
      })
      .catch((err) => console.error('Error adding product:', err));
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditProductData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category || '',
      inStock: product.inStock,
      image: null,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditProductData({});
  };

  const handleSaveEdit = () => {
    const formData = new FormData();
    Object.entries(editProductData).forEach(([key, val]) => {
      if (!(key === 'image' && val === null)) formData.append(key, key === 'price' ? parseFloat(val) : val);
    });

    fetch(`http://localhost:5000/api/products/${editingId}`, {
      method: 'PUT',
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        fetchProducts();
        cancelEdit();
      })
      .catch((err) => console.error('Error updating product:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' })
      .then(() => fetchProducts())
      .catch((err) => console.error('Delete failed:', err));
  };

  return (
    <div className="container my-4">
      <h2>Admin Dashboard</h2>

      {/* Filters */}
      <div className="card p-3 mb-4">
        <h5>Filters</h5>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
        <div className="d-flex gap-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Price"
            value={priceFilter.min}
            onChange={(e) => setPriceFilter((prev) => ({ ...prev, min: e.target.value }))}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            value={priceFilter.max}
            onChange={(e) => setPriceFilter((prev) => ({ ...prev, max: e.target.value }))}
          />
        </div>
      </div>

      {/* Add Product */}
      <div className="card p-3 mb-4">
        <h5>Add New Product</h5>
        <input name="name" className="form-control mb-2" placeholder="Name" value={newProduct.name} onChange={handleInputChange} />
        <input name="price" className="form-control mb-2" placeholder="Price" type="number" value={newProduct.price} onChange={handleInputChange} />
        <textarea name="description" className="form-control mb-2" placeholder="Description" value={newProduct.description} onChange={handleInputChange} />
        <input name="category" className="form-control mb-2" placeholder="Category" value={newProduct.category} onChange={handleInputChange} />
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" name="inStock" checked={newProduct.inStock} onChange={handleInputChange} />
          <label className="form-check-label">In Stock</label>
        </div>
        <input className="form-control mb-2" name="image" type="file" accept="image/*" onChange={handleInputChange} />
        <button className="btn btn-primary" onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* Product List */}
      <h5>Products</h5>
      {loading ? <p>Loading...</p> : error ? <p className="text-danger">{error}</p> : (
        <ul className="list-group mb-3">
          {products.map((p) => (
            <li key={p._id} className="list-group-item">
              {editingId === p._id ? (
                <>
                  <input name="name" className="form-control mb-1" value={editProductData.name} onChange={(e) => handleInputChange(e, true)} />
                  <input name="price" className="form-control mb-1" type="number" value={editProductData.price} onChange={(e) => handleInputChange(e, true)} />
                  <textarea name="description" className="form-control mb-1" value={editProductData.description} onChange={(e) => handleInputChange(e, true)} />
                  <input name="category" className="form-control mb-1" value={editProductData.category} onChange={(e) => handleInputChange(e, true)} />
                  <div className="form-check mb-1">
                    <input className="form-check-input" type="checkbox" name="inStock" checked={editProductData.inStock} onChange={(e) => handleInputChange(e, true)} />
                    <label className="form-check-label">In Stock</label>
                  </div>
                  <input className="form-control mb-2" name="image" type="file" onChange={(e) => handleInputChange(e, true)} />
                  <button className="btn btn-success btn-sm me-2" onClick={handleSaveEdit}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{p.name}</strong> - ${p.price.toFixed(2)}<br />
                  <small>{p.category} | {p.inStock ? 'In Stock' : 'Out of Stock'}</small>
                  <p>{p.description}</p>
                  {p.image && <img src={`http://localhost:5000${p.image}`} alt={p.name} style={{ maxWidth: 100 }} />}
                  <div className="mt-2">
                    <button className="btn btn-primary btn-sm me-2" onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
        <span>Page {page} of {pages}</span>
        <button className="btn btn-outline-secondary" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>Next</button>
      </div>
    </div>
  );
};

export default AdminDashboard;

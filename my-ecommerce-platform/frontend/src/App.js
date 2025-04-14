import React, { useEffect, useState } from 'react';
import './App.css';
// Importing CSS for styling

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);  // Update the state with the fetched products
      } catch (err) {
        setError(err.message);  // Set the error if there is one
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Our Products</h1>
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map(product => (
            <div key={product._id} className="product-card">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

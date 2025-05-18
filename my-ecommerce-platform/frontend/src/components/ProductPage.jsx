import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';

/*// Sample products (replace with real API data)
const sampleProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Crystal clear sound with noise cancellation.',
    price: 99.99,
    image: 'https://via.placeholder.com/300x200',
    category: 'Electronics',
    isHot: true,
  },
  {
    id: 2,
    name: 'Running Shoes',
    description: 'Comfortable and stylish for everyday wear.',
    price: 79.99,
    image: 'https://via.placeholder.com/300x200',
    category: 'Clothing',
    isHot: false,
  },
  // Add more products 
]; */



const ProductPage = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
  
        let filtered = data.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
  
        if (category) {
          filtered = filtered.filter(p => p.category === category);
        }
  
        if (sort === 'price') {
          filtered.sort((a, b) => a.price - b.price);
        }
  
        setProducts(filtered);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
  
    fetchProducts();
  }, [search, category, sort]); 
  
  return (
    <Container className="my-5">
      {/* Banner */}
      <div className="p-5 mb-4 bg-light rounded-3 text-center">
        <h1 className="display-6 fw-bold">🔥 Big Sale: Up to 30% Off!</h1>
        <p className="fs-5">Shop trending items before they're gone!</p>
        <Button variant="primary" size="lg">Shop Now</Button>
      </div>

      {/* Filters */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price">Price (Low to High)</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Product Grid */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map(product => (
          <Col key={product.id}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={product.image} />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between">
                  {product.name}
                  {product.isHot && <Badge bg="danger">Hot</Badge>}
                </Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <h5 className="text-primary">${product.price.toFixed(2)}</h5>
                  <Button size="sm" variant="primary">Buy Now</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductPage;

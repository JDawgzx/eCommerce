import React, { useEffect, useState } from 'react';
import './ProductList.css';

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('api/products')
			.then((res) => res.json())
			.then((data) => {
				setProducts(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching products:', err);
				setLoading(false);
			});
	}, []);

	if (loading) return <p>Loading products...</p>;

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Products</h2>
			<ul className="space-y-2">
				{products.map((product) => (
					<li key={product._id} className="product-card p-4 rounded shadow">
						<h3 className="font-semibold">{product.name}</h3>
						<p>${product.price}</p>
						<p>{product.description}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ProductList;

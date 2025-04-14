// seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product'); // adjust path if needed
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const seedProducts = [
	{
		name: 'Wireless Headphones',
		price: 99.99,
		description: 'Bluetooth headphones with noise-cancellation.',
	},
	{
		name: 'Smart Watch',
		price: 149.99,
		description: 'Track your fitness, notifications, and more.',
	},
	{
		name: 'Gaming Mouse',
		price: 49.99,
		description: 'Ergonomic design with customizable RGB lighting.',
	},
	{
		name: 'Mechanical Keyboard',
		price: 89.99,
		description: 'Tactile feedback and durable build for productivity and gaming.',
	},
];

const seedDB = async () => {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected.');

		await Product.deleteMany({});
		console.log('Old products removed.');

		await Product.insertMany(seedProducts);
		console.log('Sample products inserted.');

		process.exit();
	} catch (err) {
		console.error('Seeding error:', err);
		process.exit(1);
	}
};

seedDB();

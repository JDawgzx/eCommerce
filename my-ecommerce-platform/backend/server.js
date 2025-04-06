const express = require('express');
const cors = require('cors'); // CORS middleware
const app = express();  // Declare the app variable here (only once)

const port = 5000;

// Enable CORS for all routes
app.use(cors());

app.get('/products', (req, res) => {
    // Dummy data for now
    const products = [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 }
    ];
    res.json(products);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

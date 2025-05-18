/*
Updated Project Structure (backend/):

backend/
├── api/
│   └── auth/
│       ├── login.js
│       └── register.js
├── models/
│   ├── User.js
│   └── BusinessOwner.js
├── routes/
│   └── authRoutes.js
├── middleware/
│   └── authMiddleware.js
├── server.js
├── .env
*/

// server.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const loginUser = require('../api/auth/login');
const registerUser = require('../api/auth/register');

router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);

// models/BusinessOwner.js
const mongoose = require('mongoose');

const businessOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
});

module.exports = mongoose.model('BusinessOwner', businessOwnerSchema);

// api/auth/register.js
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const BusinessOwner = require('../../models/BusinessOwner');

module.exports = async (req, res) => {
  const { name, email, password, role, businessName } = req.body;

  if (!name || !email || !password || !role || (role === 'business' && !businessName)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const Model = role === 'business' ? BusinessOwner : User;

  try {
    const existing = await Model.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Model({ name, email, password: hashedPassword, businessName });
    await newUser.save();

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// api/auth/login.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const BusinessOwner = require('../../models/BusinessOwner');

module.exports = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const Model = role === 'business' ? BusinessOwner : User;

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        ...(role === 'business' && { businessName: user.businessName })
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

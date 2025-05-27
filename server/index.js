require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const User = require('./models/User');
const Country = require('./models/Country');
const State = require('./models/State');
const City = require('./models/City');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Multer setup for photo upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPG/PNG allowed'));
    }
  },
});

app.get('/', (req, res) => {
  res.send('API is running');
});

// POST /submit-profile
app.post('/submit-profile', upload.single('photo'), async (req, res) => {
  try {
    let data = req.body;
    let photoUrl = '';
    if (req.file) {
      // Store as base64 string (for demo; in production, use cloud storage)
      photoUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    // Save user
    const user = new User({
      username: data.username,
      password: data.newPassword || data.password || '', // In production, hash the password!
      profession: data.profession,
      companyName: data.companyName,
      address1: data.address1,
      country: data.country,
      state: data.state,
      city: data.city,
      plan: data.plan,
      newsletter: data.newsletter === 'true' || data.newsletter === true,
      photo: photoUrl,
    });
    await user.save();
    res.json({ success: true, userId: user._id });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /check-username
app.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ available: false, error: 'Username required' });
    const exists = await User.findOne({ username });
    res.json({ available: !exists });
  } catch (err) {
    res.status(500).json({ available: false, error: err.message });
  }
});

// GET /countries - all countries
app.get('/countries', async (req, res) => {
  try {
    const countries = await Country.find().sort('name');
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /states?countryId= - states for selected country
app.get('/states', async (req, res) => {
  try {
    const { countryId } = req.query;
    if (!countryId) return res.status(400).json({ error: 'countryId required' });
    const states = await State.find({ country: countryId }).sort('name');
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /cities?stateId= - cities for selected state
app.get('/cities', async (req, res) => {
  try {
    const { stateId } = req.query;
    if (!stateId) return res.status(400).json({ error: 'stateId required' });
    const cities = await City.find({ state: stateId }).sort('name');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
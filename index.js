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
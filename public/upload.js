const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');  // Required for checking and creating the upload directory

let pool;
function setPool(p) {
  pool = p;
}

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);  // Correctly specify the destination
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // Fixed: Pass null for no error and the filename
  }
});

const upload = multer({ storage });  // Single declaration of 'upload'

// GET route for the upload form
router.get('/upload', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('upload', { username: req.session.user.username });
});

// POST route for handling file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).send('Not logged in');

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const userid = req.session.user.userid;
    const filename = req.file.originalname;
    const filepath = req.file.path;  // Use req.file.path provided by Multer
    const { uniname, course, semester, subject } = req.body;

    // Corrected SQL query with proper columns and values
    await pool.query(
      'INSERT INTO files (filename, filepath, university_name, course, semester, subject, userid) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [filename, filepath, uniname, course, semester, subject, userid]
    );

    res.send('File uploaded successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  }
});

module.exports = { router, setPool };

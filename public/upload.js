const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // We need this for path.resolve
const fs = require('fs');
const axios = require('axios');

let pool;
function setPool(p) {
  pool = p;
}

const uploadDir = path.join(__dirname, '..', 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Clean filename storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, Date.now() + '-' + cleanName);
  }
});

const upload = multer({ storage });

router.get('/upload', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('upload', { username: req.session.user.username });
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).send('Not logged in');
    if (!req.file) return res.status(400).send('No file uploaded');

    const userid = req.session.user.userid;
    const filename = req.file.filename;
    const { uniname, course, semester, subject } = req.body;

    // --- FIXED AI LOGIC ---
    let summary = "Summary unavailable";

    try {
      // 1. GET ABSOLUTE PATH (C:\Users\...\upload\file.pdf)
      const fullPath = path.resolve(req.file.path);

      console.log("Sending path to Python:", fullPath); // Debug log

      // 2. Send full path to Python
      const flaskResponse = await axios.post('http://127.0.0.1:5000/summarize', {
        filepath: fullPath 
      });

      if (flaskResponse.data && flaskResponse.data.summary) {
        summary = flaskResponse.data.summary;
      }

    } catch (aiError) {
      // Improved error logging
      const msg = aiError.response ? JSON.stringify(aiError.response.data) : aiError.message;
      console.error("AI Summarization failed:", msg);
    }
    // ----------------------

    await pool.query(
      'INSERT INTO files (filename, filepath, university_name, course, semester, subject, userid, summary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [filename, req.file.path, uniname, course, semester, subject, userid, summary]
    );

    res.redirect('/download');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  }
});

module.exports = { router, setPool };
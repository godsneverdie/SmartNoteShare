const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // We still need Axios

// REMOVED: const pdf = require('pdf-parse'); <-- No longer needed!

let pool;
function setPool(p) {
  pool = p;
}

// Ensure upload directory
const uploadDir = path.join(__dirname, '..', 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config (Keep the URL fix)
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
    const filepath = req.file.path; // This is the full path on your disk
    const { uniname, course, semester, subject } = req.body;

    // --- SIMPLIFIED AI LOGIC ---
    let summary = "Summary unavailable";

    try {
      // We just send the FILEPATH to Python
      // Python will open the file and read it
      const flaskResponse = await axios.post('http://127.0.0.1:5000/summarize', {
        filepath: filepath 
      });

      if (flaskResponse.data && flaskResponse.data.summary) {
        summary = flaskResponse.data.summary;
      }

    } catch (aiError) {
      console.error("AI Summarization failed:", aiError.message);
    }
    // ---------------------------

    await pool.query(
      'INSERT INTO files (filename, filepath, university_name, course, semester, subject, userid, summary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [filename, filepath, uniname, course, semester, subject, userid, summary]
    );

    res.redirect('/download');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  }
});

module.exports = { router, setPool };
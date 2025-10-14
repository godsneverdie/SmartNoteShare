const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

let pool;
function setPool(p) {
  pool = p;
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..','upload')); // save in project root
  },
  filename: function (req, file, cb) {
    cb( file.originalname);
  }
});

const upload = multer({ storage });

// Upload form GET
router.get('/upload', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('upload', { username: req.session.user.username });
});
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).send('Not logged in');

    const userid = req.session.user.userid; // from session
    const filename = req.file.originalname;
    const filepath = path.join(__dirname, '..', req.file.filename);
    const {uniname, course,semester, subject}=req.body;

    await pool.query(
      'INSERT INTO files (filename, filepath, university_name, course, semester, subject,userid,) VALUES ($1, $2, $3)',
      [filename, filepath, uniname,course,semester,subject,userid]
    );

    res.send('File uploaded successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  }
});

module.exports = { router, setPool };
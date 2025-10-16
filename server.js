const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const bodyParser = require('body-parser');
const session = require('express-session');

// Auth routes
const authRoutes = require('./public/auth.js');
const { router: authRouter } = require("./public/auth");

// Upload routes
const uploadRoutes = require('./public/upload');

const app = express();

// PostgreSQL pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'userdb',
  password: 'Aman1234',
  port: 5432,
});

// Pass pool to auth and upload routes
authRoutes.setPool(pool);
uploadRoutes.setPool(pool);

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: "qwertyuiop",
  resave: false,
  saveUninitialized: false
}));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname))); // serve uploaded files from root

// Layout wrapper for EJS
app.use(function(req, res, next) {
  const originalRender = res.render;
  res.render = function(view, locals, callback) {
    if (typeof locals === 'function') {
      callback = locals;
      locals = {};
    }
    originalRender.call(res, view, locals, (err, viewHtml) => {
      if (err) {
        if (callback) callback(err);
        else return next(err);
        return;
      }
      const layoutLocals = {
        body: viewHtml,
        title: locals.title || 'My web system'
      };
      originalRender.call(res, 'layout', layoutLocals, (layoutErr, finalHtml) => {
        if (layoutErr) {
          if (callback) callback(layoutErr);
          else return next(layoutErr);
          return;
        }
        if (callback) callback(null, finalHtml);
        else res.send(finalHtml);
      });
    });
  };
  next();
});

// Routes
app.get("/", (req, res) => res.render("home", { title: "Home" }));
app.get("/about", (req, res) => res.render("about", { title: "About" }));
app.get("/logged", (req, res) => res.render("logged", { title: "logged" }));
app.get("/login", (req, res) => {
  if (req.session.user) return res.redirect('/logged');
  res.render("login", { title: "login" });
});
app.get("/register", (req, res) => res.render("register", { title: "register" }));
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});
app.get("/download", async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        // Fetch ALL file records, ordered by latest upload time
        const result = await pool.query('SELECT * FROM files ORDER BY uploaded_at DESC');
        const files = result.rows;

        res.render("download", { 
            title: "Download",
            files: files // Pass the array of file objects
        });
    } catch (err) {
        console.error("Error fetching files for download:", err);
        next(err); 
    }
});
// In app.js
app.get("/listing/:fileId", async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const fileId = req.params.fileId;

    try {
        // 1. Fetch the specific file record
        const result = await pool.query('SELECT * FROM files WHERE file_id = $1', [fileId]);
        const file = result.rows[0];

        if (!file) {
            return res.status(404).render('error', { title: "404 Not Found", message: "File listing not found." });
        }

        // 2. Render the new 'listing-detail' view
        res.render("listing-detail", { 
            title: file.filename, // Use filename as the page title
            file: file, // Pass the single file object
            // Function to format date cleanly
            formatDate: (date) => new Date(date).toLocaleString()
        });

    } catch (err) {
        console.error("Error fetching file detail:", err);
        next(err);
    }
});

// REMINDER: Keep the download route for the actual file transfer
app.get("/download/file/:fileId", /* ... your existing download logic ... */);

// Mount auth and upload routes
app.use('/', authRouter);
app.use('/', uploadRoutes.router);

// Start server
app.listen(3000, () => {
  console.log("Servxer started: http://localhost:3000");
});
const express = require("express");
const path = require("path");
const {Pool}=require("pg")
const app = express();
const authRoutes =require('./public/auth.js');
const { router } = require("./public/auth");
const bodyParser = require('body-parser');
const session = require('express-session');
const { title } = require("process");
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  

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
const pool = new Pool({
  user: 'postgres',     
  host: 'localhost',
  database: 'userdb',   
  password: 'Aman1234', 
  port: 5432,
});
authRoutes.setPool(pool);
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "qwertyuiop",
  resave: false,
  saveUninitialized: false
}));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, "public"))); 
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});
app.get("/download", (req, res) => {
  res.render("download", { title: "Download" });
});
app.get("/upload", (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render("upload", {username: req.session.user.username});
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
app.get("/logged", (req, res) => {
  res.render("logged",{title: "logged"});
});
app.get("/login", (req, res) => {
    if (req.session.user){ return res.redirect('/logged');}
    res.render("login", { title: "login" });

});
app.get("/register", (req, res) => {
  res.render("register", { title: "register" });
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});
app.use('/',authRoutes.router);
app.listen(3000, () => {
  console.log("Server started: http://localhost:3000");
});

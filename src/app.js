require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('connect-flash');

const helmetConfig = require('./config/helmetConfig')
const todoRoutes = require('./routes/todoRoutes');
const todoControllers = require('./controllers/todoController');
const sequelize = require('./db/db')
const logger = require('./utils/logger')

const app = express();
const port = 3000;

app.use(cookieParser());

app.use(helmet());
app.use(helmetConfig());

app.use(flash());

app.use(session({
  secret: process.env.SECRET_KEY, // Ganti dengan kunci rahasia Anda
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.fields_error = req.flash('fields_error');
  next();
});

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('./src/public'));

app.use(expressLayouts)
app.set('layout', 'base')

app.use(express.urlencoded({ extended: true }));

app.use('', todoRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port http://127.0.0.1/${port}`);
});

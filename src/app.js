require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

const todoControllers = require('./controllers/todoController');

const logger = require('./utils/logger')

const expressLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(expressLayouts)
app.set('layout', 'base')

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const helmet = require('helmet');
app.use(helmet());

const helmetConfig = require('./config/helmetConfig')
app.use(helmetConfig());

const session = require('express-session');
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store: new session.MemoryStore()
}));

const flash = require('connect-flash');
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.fields_error = req.flash('fields_error');
  next();
});

const csrf = require('csurf');
if(process.env.NODE_ENV !== 'test') {
  csrfProtection = csrf({ cookie: true });
  app.use(csrfProtection)
}

const todoRoutes = require('./routes/todoRoutes');
app.use('', todoRoutes);

const port = 3000;

module.exports = app
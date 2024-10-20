require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const helmetConfig = require('./config/helmetConfig')
const todoRoutes = require('./routes/todoRoutes');
const todoControllers = require('./controllers/todoController');

const app = express();
const port = 3000;


app.use(cookieParser());

app.use(helmet());
app.use(helmetConfig());

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(morgan('dev'))

app.use(expressLayouts)
app.set('layout', 'base')

app.use(express.urlencoded({ extended: true }));

app.use('', todoRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port http://127.0.0.1/${port}`);
});

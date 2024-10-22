const { Sequelize } = require('sequelize');

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: process.env.NODE_ENV === 'development' 
      ? (...msg) => console.log(msg) : false,
  }
);

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL with Sequelize'))
  .catch(err => {
    console.log(err.message);
  })
  
module.exports = sequelize;
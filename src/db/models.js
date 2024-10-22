const {DataTypes} = require('sequelize');
const sequelize = require('./db')

const Todo = sequelize.define('Todo',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  aktivitas: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'todos'
}
)

sequelize.sync()

module.exports = Todo;
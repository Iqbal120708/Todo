'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Todo extends Model {
    // Anda dapat menambahkan metode statis atau instance di sini
    static associate(models) {
      // Contoh relasi, misalnya User memiliki banyak Post
      // User.hasMany(models.Post, { foreignKey: 'userId' });
    }
  }
  
  Todo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tasks: {
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
    },
    {
      sequelize,
      modelName: 'Todo',
      tableName: 'todos',
      timestamps: true,
    }
  );

  return Todo;
};
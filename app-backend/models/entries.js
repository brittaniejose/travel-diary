'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Entries.belongsTo(models.Trips, {
        foreignKey: 'tripID'
      })
      Entries.belongsTo(models.User, {
        foreignKey: 'userID'
      })
    }
  }
  Entries.init({
    date: DataTypes.DATEONLY,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    photos: DataTypes.ARRAY(DataTypes.INTEGER),
    locations: DataTypes.ARRAY(DataTypes.INTEGER),
    tripID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Entries',
  });
  return Entries;
};
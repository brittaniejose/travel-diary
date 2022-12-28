'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trips extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Trips.belongsTo(models.User, {
        foreignKey: 'userID'
      })
      Trips.hasMany(models.Entries, {
        foreignKey: 'tripID'
      })
    }
  }
  Trips.init({
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    userID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Trips',
  });
  return Trips;
};
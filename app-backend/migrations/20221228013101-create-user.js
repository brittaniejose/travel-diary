'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        notNull: true,
        notEmpty: true
      },
      lastName: {
        type: Sequelize.STRING,
        notNull: true,
        notEmpty: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        isEmail: true
      },
      password: {
        type: Sequelize.STRING,
        notNull: true,
        notEmpty: true,
        min: 6,
        max: 23
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
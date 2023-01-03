'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATEONLY,
        validate: {
          isBetween: {
            args: ["1900-01-01", new Date().toLocaleDateString("fr-CA")],
            msg: "The date must be between 1900 and 2100"
          },
          notNull: {
            args: [true],
            msg: "Please enter a start date"
          },
          notEmpty: {
            args: [true],
            msg: "Please enter a start date"
          }, 
        }
      },
      endDate: {
        type: Sequelize.DATEONLY,
        validate: {
          isAfter: {
            args: ["startDate"],
            msg: "The end date must be after the start date"
          },
          notNull: {
            args: [true],
            msg: "Please enter an end date"
          },
          notEmpty: {
            args: [true],
            msg: "Please enter an end date"
          }, 
        }
      },
      name: {
        type: Sequelize.STRING
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
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
    await queryInterface.dropTable('Trips');
  }
};
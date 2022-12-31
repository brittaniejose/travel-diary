'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Entries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      photos: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      locations: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      tripID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Trips',
          key: 'id'
        }
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
    await queryInterface.dropTable('Entries');
  }
};
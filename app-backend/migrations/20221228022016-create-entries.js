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
        type: Sequelize.DATEONLY,
        validate: {
          isBetweenTripModelDates(date) {
            return Trips.findOne({
              where: {
                startDate: { [Op.lte]: date },
                endDate: { [Op.gte]: date }
              }
            }).then(trip => {
              if (!trip) {
                throw new Error('Date must be between the start and end date of another model');
              }
            });
          },
          allowNull: {
            args: [false],
            msg: "Please enter a date"
          },
          notEmpty: {
            args: [true],
            msg: "Please enter a date"
          }, 
        }
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING,
        validate: {
          notNull: {
            args: [true],
            msg: "Entry must have content in order to submit"
          },
          notEmpty: {
            args: [true],
            msg: "Entry must have content in order to submit"
          }, 
        }
      },
      photos: {
        type: Sequelize.ARRAY(Sequelize.JSON)
      },
      locations: {
        type: Sequelize.ARRAY(Sequelize.JSON)
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
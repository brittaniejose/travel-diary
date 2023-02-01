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
        validate: {
          notNull: {
            args: [true],
            msg: "Please enter your first name"
          },
          notEmpty: {
            args: [true],
            msg: "Please enter your first name"
          }, 
        }
      },
      lastName: {
        type: Sequelize.STRING,
        validate: {
          notNull: {
            args: [true],
            msg: "Please enter your last name"
          },
          notEmpty: {
            args: [true],
            msg: "Please enter your last name"
          }, 
        }
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          notNull: {
            args: [true],
            msg: "Please enter an email"
          },
          notEmpty: {
            args: [true],
            msg: "Please enter an email"
          },
          unique: {
            args: [true],
            msg: "This email is already registered"
          },
          isEmail: {
            args: [true],
            msg: "Please enter a valid email"
          } 
        },
      },
      password: {
        type: Sequelize.STRING,
        validate: {
          len: {
            args: [6, 100],
            msg: "The password must be at least 6 characters long"
          },
          notNull: {
            args: [true],
            msg: "Please create a password",
          },
          notEmpty: {
            args: [true],
            msg: "Please create a password"
          },
        }
      },
      icon: {
        type: Sequelize.STRING,
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
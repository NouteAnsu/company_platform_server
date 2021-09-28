'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UseDayoffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      off_type: {
        type: Sequelize.STRING
      },
      off_start: {
        type: Sequelize.DATE
      },
      off_end: {
        type: Sequelize.DATE
      },
      off_cnt: {
        type: Sequelize.FLOAT
      },
      off_comment: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.INTEGER
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UseDayoffs');
  }
};
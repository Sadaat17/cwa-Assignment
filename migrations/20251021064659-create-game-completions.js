'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_completions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      completionStatus: {
        type: Sequelize.ENUM('completed', 'failed', 'in_progress'),
        allowNull: false,
        defaultValue: 'in_progress',
      },
      timeTaken: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      totalChallenges: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      challengesCompleted: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('game_completions');
  },
};
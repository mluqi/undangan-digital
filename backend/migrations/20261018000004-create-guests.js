'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('guests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      invitation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'invitations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('VIP', 'Reguler'),
        allowNull: false,
        defaultValue: 'Reguler',
      },
      qr_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      qr_link: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      pax: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_checked_in: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('guests');
  },
};

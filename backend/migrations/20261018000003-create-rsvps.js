'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rsvps', {
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
      guest_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attendance_status: {
        type: Sequelize.ENUM('Hadir', 'Tidak Hadir', 'Ragu-ragu'),
        allowNull: false,
        defaultValue: 'Hadir',
      },
      message: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('rsvps');
  },
};

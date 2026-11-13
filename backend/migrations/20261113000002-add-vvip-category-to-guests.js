'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('guests', 'category', {
      type: Sequelize.ENUM('VIP', 'VVIP', 'Reguler', 'Grup'),
      allowNull: false,
      defaultValue: 'Reguler',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('guests', 'category', {
      type: Sequelize.ENUM('VIP', 'Reguler', 'Grup'),
      allowNull: false,
      defaultValue: 'Reguler',
    });
  },
};


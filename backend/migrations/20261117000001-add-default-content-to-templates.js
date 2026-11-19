'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('templates');
    if (!tableInfo.default_content_json) {
      await queryInterface.addColumn('templates', 'default_content_json', {
        type: Sequelize.JSON,
        allowNull: true,
        after: 'is_active',
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable('templates');
    if (tableInfo.default_content_json) {
      await queryInterface.removeColumn('templates', 'default_content_json');
    }
  },
};

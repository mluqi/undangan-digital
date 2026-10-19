'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Hapus dulu untuk mencegah duplikasi saat re-seed
    await queryInterface.bulkDelete(
      'Users',
      {
        email: [
          'admin@undangan.id',
          'planner@undangan.id',
          'client@undangan.id',
          'dimas@undangan.id',
          'arya@undangan.id',
        ],
      },
      {}
    );

    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Administrator',
        email: 'admin@undangan.id',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Sarah Wedding Organizer',
        email: 'planner@undangan.id',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Ahmad Fajar',
        email: 'client@undangan.id',
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: 'Dimas Anggara',
        email: 'dimas@undangan.id',
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: 'Arya Saloka',
        email: 'arya@undangan.id',
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Users',
      {
        email: [
          'admin@undangan.id',
          'planner@undangan.id',
          'client@undangan.id',
          'dimas@undangan.id',
          'arya@undangan.id',
        ],
      },
      {}
    );
  },
};

'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await bcrypt.hash('genius80', 10);
    
    await queryInterface.bulkInsert({
      tableName: 'users',
      schema: 'private'
    }, [{
      email: 'gmaluk@70w.cl',
      password_hash: password,
      full_name: 'Gustavo Maluk',
      role: 'ADMINISTRATOR',
      active: true,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete({ 
      tableName: 'users', 
      schema: 'private' 
    }, null, {});
  }
};
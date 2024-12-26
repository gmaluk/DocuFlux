//docuflux/backend/config/config.js

require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: 'ZyQsA#C*U9j&@blG8hp$6vqBU*VF*Qcw',
    database: 'docuflux_db',
    host: 'localhost',
    dialect: 'postgres',
    schema: 'private',
    define: {
      timestamps: true,
      underscored: true
    },
    migrationStorageTableSchema: 'private',
    seederStorage: 'sequelize',
    seederStorageTableSchema: 'private',
    seederStorageTableName: 'sequelize_seeds'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    schema: 'private'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    schema: 'private'
  }
};
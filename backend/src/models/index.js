//docuflux.backend/src/models/index.js

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      ...config,
      define: {
        schema: config.schema
      }
    }
  );
}

// Definir el orden de carga de modelos
const modelOrder = [
  'user.js',
  'company.js',
  'provider.js',
  'document.js',
  'payment_flow.js',
  'accounting_distribution.js'
];

// Cargar modelos en orden específico
modelOrder.forEach(file => {
  try {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  } catch (error) {
    console.error(`Error loading model ${file}:`, error.message);
  }
});

// Establecer asociaciones después de que todos los modelos estén cargados
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
    } catch (error) {
      console.error(`Error associating model ${modelName}:`, error.message);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
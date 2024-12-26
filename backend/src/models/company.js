'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      // Solo definir las asociaciones si los modelos existen
      if (models.Provider) {
        Company.hasMany(models.Provider, {
          foreignKey: 'company_id',
          as: 'providers'
        });
      }

      if (models.Document) {
        Company.hasMany(models.Document, {
          foreignKey: 'company_id',
          as: 'documents'
        });
      }

      if (models.PaymentFlow) {
        Company.hasMany(models.PaymentFlow, {
          foreignKey: 'company_id',
          as: 'payment_flows'
        });
      }
    }
  }

  Company.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Company name is required'
        },
        notEmpty: {
          msg: 'Company name cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'Company name must be between 2 and 255 characters'
        }
      }
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Tax ID is required'
        },
        notEmpty: {
          msg: 'Tax ID cannot be empty'
        },
        len: {
          args: [5, 50],
          msg: 'Tax ID must be between 5 and 50 characters'
        },
        isValidTaxId(value) {
          if (!/^[0-9\-\.]+$/.test(value)) {
            throw new Error('Invalid Tax ID format');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
    schema: 'private',
    underscored: true,
    timestamps: true
  });

  return Company;
};
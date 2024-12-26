'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.Provider, {
        foreignKey: 'company_id',
        as: 'providers'
      });

      Company.hasMany(models.Document, {
        foreignKey: 'company_id',
        as: 'documents'
      });

      Company.belongsTo(models.PaymentCalendar, {
        foreignKey: 'payment_calendar_id',
        as: 'payment_calendar'
      });
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
    },
    payment_calendar_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'payment_calendars',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
    schema: 'private',
    underscored: true
  });

  return Company;
};
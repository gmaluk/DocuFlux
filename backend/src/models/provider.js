'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    static associate(models) {
      // Provider belongs to a Company
      if (models.Company) {
        Provider.belongsTo(models.Company, {
          foreignKey: 'company_id',
          as: 'company'
        });
      }

      // Provider has a Controller (User)
      if (models.User) {
        Provider.belongsTo(models.User, {
          foreignKey: 'controller_id',
          as: 'controller'
        });
      }

      // Provider has many Documents
      if (models.Document) {
        Provider.hasMany(models.Document, {
          foreignKey: 'provider_id',
          as: 'documents'
        });
      }
    }
  }

  Provider.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provider name is required'
        },
        notEmpty: {
          msg: 'Provider name cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'Provider name must be between 2 and 255 characters'
        }
      }
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      validate: {
        notNull: {
          msg: 'Company ID is required'
        }
      }
    },
    controller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      validate: {
        notNull: {
          msg: 'Controller ID is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Provider',
    tableName: 'providers',
    schema: 'private',
    underscored: true,
    timestamps: true
  });

  return Provider;
};
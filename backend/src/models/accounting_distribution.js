'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccountingDistribution extends Model {
    static associate(models) {
      // AccountingDistribution belongs to a Document
      if (models.Document) {
        AccountingDistribution.belongsTo(models.Document, {
          foreignKey: 'document_id',
          as: 'document'
        });
      }
    }
  }

  AccountingDistribution.init({
    document_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'documents',
        key: 'id'
      },
      validate: {
        notNull: {
          msg: 'Document ID is required'
        }
      }
    },
    account_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Account number is required'
        },
        notEmpty: {
          msg: 'Account number cannot be empty'
        }
      }
    },
    project_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Project code is required'
        },
        notEmpty: {
          msg: 'Project code cannot be empty'
        }
      }
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Amount is required'
        },
        isDecimal: {
          msg: 'Amount must be a decimal number'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'AccountingDistribution',
    tableName: 'accounting_distributions',
    schema: 'private',
    underscored: true,
    timestamps: true
  });

  return AccountingDistribution;
};
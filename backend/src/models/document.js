'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      // Document belongs to a Provider
      if (models.Provider) {
        Document.belongsTo(models.Provider, {
          foreignKey: 'provider_id',
          as: 'provider'
        });
      }

      // Document belongs to a Company
      if (models.Company) {
        Document.belongsTo(models.Company, {
          foreignKey: 'company_id',
          as: 'company'
        });
      }

      // Document belongs to a Controller (User)
      if (models.User) {
        Document.belongsTo(models.User, {
          foreignKey: 'controller_id',
          as: 'controller'
        });

        // Document was created by a User
        Document.belongsTo(models.User, {
          foreignKey: 'created_by',
          as: 'creator'
        });

        // Document was approved by a User
        Document.belongsTo(models.User, {
          foreignKey: 'approved_by',
          as: 'approver'
        });

        // Document was distributed by a User
        Document.belongsTo(models.User, {
          foreignKey: 'distributed_by',
          as: 'distributor'
        });
      }

      // Document has many Accounting Distributions
      if (models.AccountingDistribution) {
        Document.hasMany(models.AccountingDistribution, {
          foreignKey: 'document_id',
          as: 'distributions'
        });
      }
    }
  }

  Document.init({
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'providers',
        key: 'id'
      }
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    controller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    document_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Document number is required'
        },
        notEmpty: {
          msg: 'Document number cannot be empty'
        }
      }
    },
    document_type: {
      type: DataTypes.ENUM('INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE', 'OTHER'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Document type is required'
        }
      }
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'File path is required'
        },
        notEmpty: {
          msg: 'File path cannot be empty'
        }
      }
    },
    approved_file_path: {
      type: DataTypes.STRING(255)
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'DISTRIBUTED'),
      defaultValue: 'PENDING'
    },
    payment_date: {
      type: DataTypes.DATE
    },
    entry_observations: {
      type: DataTypes.TEXT
    },
    notes: {
      type: DataTypes.TEXT
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approved_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    distributed_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approved_at: {
      type: DataTypes.DATE
    },
    distributed_at: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    schema: 'private',
    underscored: true,
    timestamps: true
  });

  return Document;
};
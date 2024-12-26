'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentFlow extends Model {
    static associate(models) {
      // PaymentFlow belongs to a Company
      PaymentFlow.belongsTo(models.Company, {
        foreignKey: 'company_id',
        as: 'company'
      });
    }
  }

  PaymentFlow.init({
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
    payment_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Payment day is required'
        },
        min: {
          args: 1,
          msg: 'Payment day must be between 1 and 31'
        },
        max: {
          args: 31,
          msg: 'Payment day must be between 1 and 31'
        }
      }
    },
    cutoff_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Cutoff day is required'
        },
        min: {
          args: 1,
          msg: 'Cutoff day must be between 1 and 31'
        },
        max: {
          args: 31,
          msg: 'Cutoff day must be between 1 and 31'
        },
        isBeforePaymentDay(value) {
          if (this.payment_day && value >= this.payment_day) {
            throw new Error('Cutoff day must be before payment day');
          }
        }
      }
    },
    approval_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Approval day is required'
        },
        min: {
          args: 1,
          msg: 'Approval day must be between 1 and 31'
        },
        max: {
          args: 31,
          msg: 'Approval day must be between 1 and 31'
        },
        isBetweenCutoffAndPayment(value) {
          if (this.cutoff_day && this.payment_day && 
              (value <= this.cutoff_day || value >= this.payment_day)) {
            throw new Error('Approval day must be between cutoff day and payment day');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'PaymentFlow',
    tableName: 'payment_flows',
    schema: 'private',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['company_id', 'payment_day'],
        name: 'unique_payment_day_per_company'
      }
    ]
  });

  return PaymentFlow;
};
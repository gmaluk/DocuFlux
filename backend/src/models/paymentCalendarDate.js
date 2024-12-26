'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentCalendarDate extends Model {
    static associate(models) {
      PaymentCalendarDate.belongsTo(models.PaymentCalendar, {
        foreignKey: 'calendar_id',
        as: 'calendar'
      });
    }
  }

  PaymentCalendarDate.init({
    calendar_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 31
      }
    },
    cutoff_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 31
      }
    },
    approval_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 31
      }
    }
  }, {
    sequelize,
    modelName: 'PaymentCalendarDate',
    tableName: 'payment_calendar_dates',
    schema: 'private',
    underscored: true
  });

  return PaymentCalendarDate;
};
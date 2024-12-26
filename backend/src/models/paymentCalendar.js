'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentCalendar extends Model {
    static associate(models) {
      PaymentCalendar.hasMany(models.PaymentCalendarDate, {
        foreignKey: 'calendar_id',
        as: 'dates',
        onDelete: 'CASCADE'
      });

      PaymentCalendar.hasMany(models.Company, {
        foreignKey: 'payment_calendar_id',
        as: 'companies'
      });
    }
  }

  PaymentCalendar.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'PaymentCalendar',
    tableName: 'payment_calendars',
    schema: 'private',
    underscored: true
  });

  return PaymentCalendar;
};
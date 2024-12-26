'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tabla de calendarios
    await queryInterface.createTable('payment_calendars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      schema: 'private'
    });

    // Crear tabla para las fechas del calendario
    await queryInterface.createTable('payment_calendar_dates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      calendar_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'payment_calendars',
            schema: 'private'
          },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      payment_day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cutoff_day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      approval_day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      schema: 'private'
    });

    // Agregar columna calendar_id a la tabla companies
    await queryInterface.addColumn('companies', 'payment_calendar_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'payment_calendars',
          schema: 'private'
        },
        key: 'id'
      },
      schema: 'private'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'payment_calendar_id', { schema: 'private' });
    await queryInterface.dropTable({ tableName: 'payment_calendar_dates', schema: 'private' });
    await queryInterface.dropTable({ tableName: 'payment_calendars', schema: 'private' });
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_flows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'companies',
            schema: 'private'
          },
          key: 'id'
        }
      },
      payment_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 31
        }
      },
      cutoff_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 31
        }
      },
      approval_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 31
        }
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

    // Add unique constraint to prevent duplicate payment days for the same company
    await queryInterface.addConstraint('private.payment_flows', {
      fields: ['company_id', 'payment_day'],
      type: 'unique',
      name: 'unique_payment_day_per_company'
    });

    // Add index for company_id for faster lookups
    await queryInterface.addIndex('private.payment_flows', ['company_id'], {
      name: 'idx_payment_flows_company'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ tableName: 'payment_flows', schema: 'private' });
  }
};
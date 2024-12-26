'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create enums
    await queryInterface.sequelize.query(`
      CREATE TYPE "private"."user_role" AS ENUM ('DOCUMENT_RECEIVER', 'CONTROLLER', 'PROVIDER_ACCOUNTANT', 'ADMINISTRATOR');
      CREATE TYPE "private"."document_status" AS ENUM ('PENDING', 'APPROVED', 'DISTRIBUTED');
      CREATE TYPE "private"."document_type" AS ENUM ('INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE', 'OTHER');
    `);

    // Create Users table
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('DOCUMENT_RECEIVER', 'CONTROLLER', 'PROVIDER_ACCOUNTANT', 'ADMINISTRATOR'),
        allowNull: false
      },
      signature_path: {
        type: Sequelize.STRING(255)
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    // Create Companies table (without JSON fields)
    await queryInterface.createTable('companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      tax_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
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

    // Create Providers table
    await queryInterface.createTable('providers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      tax_id: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'companies',
            schema: 'private'
          },
          key: 'id'
        }
      },
      controller_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'private'
          },
          key: 'id'
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

    // Add unique constraint for tax_id and company_id
    await queryInterface.addConstraint('private.providers', {
      fields: ['tax_id', 'company_id'],
      type: 'unique',
      name: 'unique_provider_per_company'
    });

    // Create Documents table
    await queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'providers',
            schema: 'private'
          },
          key: 'id'
        }
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
      controller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'private'
          },
          key: 'id'
        }
      },
      document_number: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      document_type: {
        type: Sequelize.ENUM('INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE', 'OTHER'),
        allowNull: false
      },
      file_path: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      approved_file_path: {
        type: Sequelize.STRING(255)
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'DISTRIBUTED'),
        defaultValue: 'PENDING'
      },
      payment_date: {
        type: Sequelize.DATE
      },
      entry_observations: {
        type: Sequelize.TEXT
      },
      notes: {
        type: Sequelize.TEXT
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'private'
          },
          key: 'id'
        }
      },
      approved_by: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'private'
          },
          key: 'id'
        }
      },
      distributed_by: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'private'
          },
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      approved_at: {
        type: Sequelize.DATE
      },
      distributed_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      schema: 'private'
    });

    // Add unique constraint for company_id, document_type and document_number
    await queryInterface.addConstraint('private.documents', {
      fields: ['company_id', 'document_type', 'document_number'],
      type: 'unique',
      name: 'unique_document_per_company'
    });

    // Create Accounting Distributions table
    await queryInterface.createTable('accounting_distributions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      document_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'documents',
            schema: 'private'
          },
          key: 'id'
        }
      },
      account_number: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      project_code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
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

    // Create indexes
    await queryInterface.addIndex('private.documents', ['status'], { name: 'idx_documents_status' });
    await queryInterface.addIndex('private.documents', ['controller_id'], { name: 'idx_documents_controller' });
    await queryInterface.addIndex('private.documents', ['provider_id'], { name: 'idx_documents_provider' });
    await queryInterface.addIndex('private.providers', ['controller_id'], { name: 'idx_providers_controller' });
    await queryInterface.addIndex('private.users', ['role'], { name: 'idx_users_role' });
  },

  async down (queryInterface, Sequelize) {
    // Drop indexes
    await queryInterface.removeIndex('private.documents', 'idx_documents_status');
    await queryInterface.removeIndex('private.documents', 'idx_documents_controller');
    await queryInterface.removeIndex('private.documents', 'idx_documents_provider');
    await queryInterface.removeIndex('private.providers', 'idx_providers_controller');
    await queryInterface.removeIndex('private.users', 'idx_users_role');

    // Drop tables
    await queryInterface.dropTable({ tableName: 'accounting_distributions', schema: 'private' });
    await queryInterface.dropTable({ tableName: 'documents', schema: 'private' });
    await queryInterface.dropTable({ tableName: 'providers', schema: 'private' });
    await queryInterface.dropTable({ tableName: 'companies', schema: 'private' });
    await queryInterface.dropTable({ tableName: 'users', schema: 'private' });

    // Drop enums
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "private"."user_role";
      DROP TYPE IF EXISTS "private"."document_status";
      DROP TYPE IF EXISTS "private"."document_type";
    `);
  }
};
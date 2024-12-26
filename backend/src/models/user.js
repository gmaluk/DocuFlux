'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Providers that this user controls (as a controller)
      User.hasMany(models.Provider, {
        foreignKey: 'controller_id',
        as: 'controlled_providers'
      });

      // Documents that this user controls
      User.hasMany(models.Document, {
        foreignKey: 'controller_id',
        as: 'controlled_documents'
      });

      // Documents created by this user
      User.hasMany(models.Document, {
        foreignKey: 'created_by',
        as: 'created_documents'
      });

      // Documents approved by this user
      User.hasMany(models.Document, {
        foreignKey: 'approved_by',
        as: 'approved_documents'
      });

      // Documents distributed by this user
      User.hasMany(models.Document, {
        foreignKey: 'distributed_by',
        as: 'distributed_documents'
      });
    }

    // Instance method to safely return user data without sensitive information
    toSafeObject() {
      const { id, email, full_name, role, signature_path, active } = this;
      return { id, email, full_name, role, signature_path, active };
    }

    // Instance method to verify password
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password_hash);
    }

    // Class method to hash password
    static async hashPassword(password) {
      return await bcrypt.hash(password, 10);
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email must be a valid email address'
        },
        notNull: {
          msg: 'Email is required'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is required'
        }
      }
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Full name is required'
        },
        notEmpty: {
          msg: 'Full name cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'Full name must be between 2 and 255 characters'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('DOCUMENT_RECEIVER', 'CONTROLLER', 'PROVIDER_ACCOUNTANT', 'ADMINISTRATOR'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Role is required'
        },
        isIn: {
          args: [['DOCUMENT_RECEIVER', 'CONTROLLER', 'PROVIDER_ACCOUNTANT', 'ADMINISTRATOR']],
          msg: 'Invalid role specified'
        }
      }
    },
    signature_path: {
      type: DataTypes.STRING(255),
      validate: {
        isValidPath(value) {
          if (value && !/^[\w\-. /\\]+$/.test(value)) {
            throw new Error('Invalid signature file path');
          }
        }
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    schema: 'private',
    underscored: true,
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['password_hash'] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password_hash'] }
      }
    }
  });

  // Hooks
  User.beforeCreate(async (user) => {
    if (user.changed('password_hash')) {
      user.password_hash = await User.hashPassword(user.password_hash);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password_hash')) {
      user.password_hash = await User.hashPassword(user.password_hash);
    }
  });

  return User;
};
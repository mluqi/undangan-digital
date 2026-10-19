'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    static associate(models) {
      Guest.belongsTo(models.Invitation, {
        foreignKey: 'invitation_id',
        as: 'invitation',
      });
    }
  }

  Guest.init(
    {
      invitation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Invitation ID wajib diisi' },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nama tamu tidak boleh kosong' },
        },
      },
      category: {
        type: DataTypes.ENUM('VIP', 'Reguler'),
        allowNull: false,
        defaultValue: 'Reguler',
      },
      qr_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      qr_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_checked_in: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      check_in_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Guest',
      tableName: 'guests',
      underscored: true,
    }
  );

  return Guest;
};

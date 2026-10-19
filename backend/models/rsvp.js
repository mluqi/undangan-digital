'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rsvp extends Model {
    static associate(models) {
      // Relasi ke Invitation
      Rsvp.belongsTo(models.Invitation, {
        foreignKey: 'invitation_id',
        as: 'invitation',
      });
    }
  }

  Rsvp.init(
    {
      invitation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Invitation ID wajib diisi' },
        },
      },
      guest_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nama tamu tidak boleh kosong' },
        },
      },
      attendance_status: {
        type: DataTypes.ENUM('Hadir', 'Tidak Hadir', 'Ragu-ragu'),
        allowNull: false,
        defaultValue: 'Hadir',
        validate: {
          isIn: {
            args: [['Hadir', 'Tidak Hadir', 'Ragu-ragu']],
            msg: 'Status kehadiran harus berupa: Hadir, Tidak Hadir, atau Ragu-ragu',
          },
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Rsvp',
      tableName: 'rsvps',
      underscored: true,
    }
  );

  return Rsvp;
};

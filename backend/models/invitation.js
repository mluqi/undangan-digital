'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    static associate(models) {
      // Relasi ke User (admin pembuat)
      Invitation.belongsTo(models.User, {
        foreignKey: 'admin_id',
        as: 'admin',
      });

      // Relasi ke Template
      Invitation.belongsTo(models.Template, {
        foreignKey: 'template_id',
        as: 'template',
      });

      // Relasi ke RSVP (ucapan & kehadiran)
      Invitation.hasMany(models.Rsvp, {
        foreignKey: 'invitation_id',
        as: 'rsvps',
      });

      // Relasi ke Tamu Terdaftar (Guest List & QR Check-in)
      Invitation.hasMany(models.Guest, {
        foreignKey: 'invitation_id',
        as: 'guests',
      });
    }
  }

  Invitation.init(
    {
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Admin ID wajib diisi' },
        },
      },
      template_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Template ID wajib diisi' },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Slug undangan sudah digunakan' },
        validate: {
          notEmpty: { msg: 'Slug tidak boleh kosong' },
        },
      },
      client_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nama client tidak boleh kosong' },
        },
      },
      expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      content_json: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Invitation',
      tableName: 'invitations',
      underscored: true,
    }
  );

  return Invitation;
};

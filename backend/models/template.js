'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    static associate(models) {
      Template.hasMany(models.Invitation, {
        foreignKey: 'template_id',
        as: 'invitations',
      });
    }
  }

  Template.init(
    {
      template_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Kode template sudah digunakan' },
        validate: {
          notEmpty: { msg: 'Kode template tidak boleh kosong' },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nama template tidak boleh kosong' },
        },
      },
      thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Template',
      tableName: 'templates',
      underscored: true,
    }
  );

  return Template;
};

const { User, Invitation } = require('../models');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Invitation, as: 'invitations' }],
    });
    if (!user) {
      const err = new Error('User tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }

  async createUser(data) {
    const { name, email, password, role } = data;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      const err = new Error('Email sudah terdaftar.');
      err.statusCode = 409;
      throw err;
    }

    return await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) {
      const err = new Error('User tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ where: { email: data.email } });
      if (existing) {
        const err = new Error('Email sudah digunakan oleh akun lain.');
        err.statusCode = 409;
        throw err;
      }
    }

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    } else {
      delete data.password;
    }

    await user.update(data);
    return user;
  }

  async deleteUser(id, currentUserId) {
    if (parseInt(id, 10) === parseInt(currentUserId, 10)) {
      const err = new Error('Tidak dapat menghapus akun Anda sendiri.');
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findByPk(id);
    if (!user) {
      const err = new Error('User tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    await user.destroy();
    return { message: 'User berhasil dihapus.' };
  }
}

module.exports = new UserService();

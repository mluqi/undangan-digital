const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
});

// @desc    Register user baru
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi.',
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
      });
    }

    // Buat user baru (password di-hash otomatis oleh hook model)
    const newUser = await User.create({
      name,
      email,
      password,
      role: role && ['user', 'admin'].includes(role) ? role : 'user',
    });

    const token = generateToken(newUser);

    // Set cookie token
    res.cookie('token', token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil.',
      data: newUser,
      token,
    });
  } catch (error) {
    console.error('Error saat register:', error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat registrasi.',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi.',
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah.',
      });
    }

    // Periksa kecocokan password
    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah.',
      });
    }

    const token = generateToken(user);

    // Set cookie token
    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: user,
      token,
    });
  } catch (error) {
    console.error('Error saat login:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat login.',
      error: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private / Public
const logout = async (req, res) => {
  try {
    res.clearCookie('token', getCookieOptions());
    return res.status(200).json({
      success: true,
      message: 'Logout berhasil.',
    });
  } catch (error) {
    console.error('Error saat logout:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat logout.',
      error: error.message,
    });
  }
};

// @desc    Get user profile (current logged in user)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error('Error saat mengambil profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};

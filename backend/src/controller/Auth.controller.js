import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerSuperAdmin = async (req, res) => {
  try {
    const { userId, name, email, password } = req.body;

    const existingSuperAdmin = await User.findOne({ role: 'superAdmin' });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: 'Super admin already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newSuperAdmin = new User({
      userId,
      name,
      email,
      password: hashPassword,
      role: 'superAdmin',
    });

    await newSuperAdmin.save();

    res
      .status(201)
      .json({ message: 'Super admin created successfully', superAdmin: newSuperAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating super admin', error: err.message });
  }
};

export const createUserByAdmins = async (req, res) => {
  try {
    const { userId, name, email, password, role } = req.body;

    if (role === 'admin' && req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only super admin can create admin' });
    }

    if (role === 'user' && req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only admin or super admin can create user' });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      userId,
      name,
      email,
      password: hashPassword,
      role,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating admin', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: 'User ID and password are required' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, { httpOnly: true });
    res.json({
      message: 'Login successful',
      user: { userId: user.userId, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
    console.error('Login error:', err);
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: 'Unauthorized !! No token provided' });
    }
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error logging out', error: err.message });
    console.error('Logout error:', err);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ userId }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ profile: user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
    console.error('Get profile error:', err);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
      return res
        .status(403)
        .json({ message: 'Only admin or super admin can access this resource' });
    }
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
    console.error('Get all users error:', err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only admin or super admin can delete user' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin' && req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only super admin can delete admin' });
    }
    await User.deleteOne({ userId });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
    console.error('Delete user error:', err);
  }
};

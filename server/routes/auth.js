import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import { sendEmail, getSignupEmailTemplate, getSigninEmailTemplate, getPasswordResetEmailTemplate } from '../utils/emailService.js';

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone
    });

    await user.save();

    // Send signup email
    const emailTemplate = getSignupEmailTemplate(name, email);
    const emailResult = await sendEmail(email, '🎉 Welcome to ShreeradheKrishnacollection - Registration Successful', emailTemplate);

    if (!emailResult.success) {
      console.warn('⚠️ Signup email failed to send:', emailResult.error);
      // Don't fail the signup just because email failed
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Send login notification email
    const emailTemplate = getSigninEmailTemplate(user.name, user.email, new Date());
    const emailResult = await sendEmail(user.email, '🔐 ShreeradheKrishnacollection - Sign In Notification', emailTemplate);

    if (!emailResult.success) {
      console.warn('⚠️ Login notification email failed to send:', emailResult.error);
      // Don't fail the login just because email failed
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        addresses: user.addresses,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address, addresses, addAddress, updateAddressId, deleteAddressId } = req.body;

    const user = await User.findById(req.userId);

    // Update basic fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Handle adding a new address
    if (addAddress) {
      const newAddress = {
        label: addAddress.label || 'Home',
        street: addAddress.street,
        city: addAddress.city,
        state: addAddress.state,
        zipCode: addAddress.zipCode,
        country: addAddress.country || 'India',
        phone: addAddress.phone,
        isDefault: addAddress.isDefault || false
      };

      // If this is the default, unset other defaults
      if (newAddress.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }

      user.addresses.push(newAddress);
    }

    // Handle updating an address
    if (updateAddressId) {
      const addrIndex = user.addresses.findIndex(a => a._id.toString() === updateAddressId);
      if (addrIndex !== -1) {
        user.addresses[addrIndex] = {
          ...user.addresses[addrIndex].toObject(),
          ...req.body.updateAddress,
        };
      }
    }

    // Handle deleting an address
    if (deleteAddressId) {
      user.addresses = user.addresses.filter(a => a._id.toString() !== deleteAddressId);
    }

    // Replace all addresses if provided
    if (addresses && Array.isArray(addresses)) {
      user.addresses = addresses;
    }

    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        addresses: user.addresses,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Forgot Password - Generate reset token
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists for security reasons
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link shortly.'
      });
    }

    // Generate reset token (random 32-byte hex string)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiry to 1 hour from now
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);

    // Save token hash to database
    user.resetToken = resetTokenHash;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create reset URL with unhashed token
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`;

    // Send email
    const emailTemplate = getPasswordResetEmailTemplate(user.name, resetUrl);
    const emailResult = await sendEmail(
      user.email,
      '🔐 ShreeradheKrishnacollection - Password Reset Request',
      emailTemplate
    );

    if (!emailResult.success) {
      console.warn('⚠️ Password reset email failed to send:', emailResult.error);
    }

    // Always return success message for security
    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link shortly.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset Password - Validate token and update password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Hash the token to compare with database
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: resetTokenHash,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;

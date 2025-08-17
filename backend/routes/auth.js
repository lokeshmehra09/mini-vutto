const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const { generateOTP, sendOTPEmail } = require('../utils/emailService');
const router = express.Router();

// Register new user with OTP verification
router.post('/register', async (req, res) => {
  try {
    const { email, password, otp, role, first_name, last_name } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Validate last_name is required
    if (!last_name) {
      return res.status(400).json({ message: 'last_name is required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Validate role
    const validRoles = ['customer', 'seller'];
    const userRole = role && validRoles.includes(role) ? role : 'customer'; // Default to customer if no valid role
    
    // Check if user already exists
    const existingUser = await req.app.locals.db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // If OTP is provided, verify it
    if (otp) {
      const otpResult = await req.app.locals.db.query(
        'SELECT * FROM verification_tokens WHERE email = $1 AND token = $2 AND expires_at > NOW()',
        [email, otp]
      );
      
      if (otpResult.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      
      // Delete used OTP
      await req.app.locals.db.query(
        'DELETE FROM verification_tokens WHERE email = $1',
        [email]
      );
    } else {
      // No OTP provided, send verification email
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Store OTP
      await req.app.locals.db.query(
        'INSERT INTO verification_tokens (email, token, expires_at) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET token = $2, expires_at = $3',
        [email, otp, expiresAt]
      );
      
      // Send OTP email
      const emailSent = await sendOTPEmail(email, otp);
      
      if (!emailSent) {
        return res.status(500).json({ message: 'Failed to send verification email' });
      }
      
      return res.json({
        message: 'Please check your email for OTP verification code',
        email: email,
        expires_in: '10 minutes'
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const result = await req.app.locals.db.query(
      'INSERT INTO users (email, password_hash, role, is_verified, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, role, created_at',
      [email, passwordHash, userRole, true, first_name, last_name]
    );
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        created_at: user.created_at
      },
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user (only verified users can login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const result = await req.app.locals.db.query(
      'SELECT id, email, password_hash, role, is_verified FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check if user is verified
    if (!user.is_verified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        needs_verification: true
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin/Management endpoint)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const result = await req.app.locals.db.query(
      'SELECT id, email, first_name, last_name, role, is_verified, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({
      message: 'Users retrieved successfully',
      total_users: result.rows.length,
      users: result.rows
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID
router.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await req.app.locals.db.query(
      'SELECT id, email, first_name, last_name, role, is_verified, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User profile retrieved successfully',
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validate role
    const validRoles = ['customer', 'seller'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role. Must be either "customer" or "seller"' 
      });
    }
    
    // Check if user exists
    const userCheck = await req.app.locals.db.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update role
    await req.app.locals.db.query(
      'UPDATE users SET role = $1 WHERE id = $2',
      [role, id]
    );
    
    res.json({
      message: 'User role updated successfully',
      user_id: id,
      new_role: role
    });
    
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user verification status
router.patch('/users/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;
    
    // Check if user exists
    const userCheck = await req.app.locals.db.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update verification status
    await req.app.locals.db.query(
      'UPDATE users SET is_verified = $1 WHERE id = $2',
      [is_verified, id]
    );
    
    res.json({
      message: 'User verification status updated successfully',
      user_id: id,
      is_verified: is_verified
    });
    
  } catch (error) {
    console.error('Update user verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user information (first_name, last_name)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name } = req.body;
    
    // Validate input - last_name is required
    if (!last_name) {
      return res.status(400).json({ 
        message: 'last_name is required' 
      });
    }
    
    // Check if user exists
    const userCheck = await req.app.locals.db.query(
      'SELECT id, email, role, first_name, last_name FROM users WHERE id = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentUser = userCheck.rows[0];
    
    // Prepare update query dynamically based on provided fields
    let updateQuery = 'UPDATE users SET ';
    let queryParams = [];
    let paramCount = 1;
    
    if (first_name !== undefined) {
      updateQuery += `first_name = $${paramCount}`;
      queryParams.push(first_name);
      paramCount++;
    }
    
    if (last_name !== undefined) {
      if (first_name !== undefined) {
        updateQuery += ', ';
      }
      updateQuery += `last_name = $${paramCount}`;
      queryParams.push(last_name);
      paramCount++;
    }
    
    updateQuery += ` WHERE id = $${paramCount}`;
    queryParams.push(id);
    
    // Execute update
    await req.app.locals.db.query(updateQuery, queryParams);
    
    // Get updated user data
    const updatedUser = await req.app.locals.db.query(
      'SELECT id, email, role, first_name, last_name, is_verified, created_at FROM users WHERE id = $1',
      [id]
    );
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser.rows[0]
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const userCheck = await req.app.locals.db.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await req.app.locals.db.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    
    res.json({
      message: 'User deleted successfully',
      deleted_user_id: id
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



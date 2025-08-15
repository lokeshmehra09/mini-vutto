const express = require('express');
const router = express.Router();
const { authenticateToken, isOwner } = require('../middleware/auth');

// Get all bikes with optional search
router.get('/', async (req, res) => {
  try {
    const { brand, model, search } = req.query;
    let query = 'SELECT b.*, u.email as seller_email FROM bikes b JOIN users u ON b.seller_id = u.id';
    let params = [];
    let conditions = [];
    
    if (brand) {
      conditions.push(`b.brand ILIKE $${params.length + 1}`);
      params.push(`%${brand}%`);
    }
    
    if (model) {
      conditions.push(`b.model ILIKE $${params.length + 1}`);
      params.push(`%${model}%`);
    }
    
    if (search) {
      conditions.push(`(b.brand ILIKE $${params.length + 1} OR b.model ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY b.created_at DESC';
    
    const result = await req.app.locals.db.query(query, params);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Get bikes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's own listings (must come before /:id route)
router.get('/my/listings', authenticateToken, async (req, res) => {
  try {
    const seller_id = req.user.id;
    
    const result = await req.app.locals.db.query(
      'SELECT * FROM bikes WHERE seller_id = $1 ORDER BY created_at DESC',
      [seller_id]
    );
    
    res.json(result.rows);
    
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single bike by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await req.app.locals.db.query(
      'SELECT b.*, u.email as seller_email FROM bikes b JOIN users u ON b.seller_id = u.id WHERE b.id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Get bike error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new bike (authenticated)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { brand, model, year, price, kilometers_driven, location, image_url } = req.body;
    const seller_id = req.user.id;
    
    // Validate input
    if (!brand || !model || !year || !price || !kilometers_driven || !location) {
      return res.status(400).json({ message: 'All fields are required except image_url' });
    }
    
    if (year < 1900 || year > new Date().getFullYear() + 1) {
      return res.status(400).json({ message: 'Invalid year' });
    }
    
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be positive' });
    }
    
    if (kilometers_driven < 0) {
      return res.status(400).json({ message: 'Kilometers driven cannot be negative' });
    }
    
    const result = await req.app.locals.db.query(
      'INSERT INTO bikes (brand, model, year, price, kilometers_driven, location, image_url, seller_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [brand, model, year, price, kilometers_driven, location, image_url, seller_id]
    );
    
    res.status(201).json({
      message: 'Bike added successfully',
      bike: result.rows[0]
    });
    
  } catch (error) {
    console.error('Add bike error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bike (authenticated, owner only)
router.put('/:id', authenticateToken, isOwner, async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, model, year, price, kilometers_driven, location, image_url } = req.body;
    
    // Validate input
    if (!brand || !model || !year || !price || !kilometers_driven || !location) {
      return res.status(400).json({ message: 'All fields are required except image_url' });
    }
    
    if (year < 1900 || year > new Date().getFullYear() + 1) {
      return res.status(400).json({ message: 'Invalid year' });
    }
    
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be positive' });
    }
    
    if (kilometers_driven < 0) {
      return res.status(400).json({ message: 'Kilometers driven cannot be negative' });
    }
    
    const result = await req.app.locals.db.query(
      'UPDATE bikes SET brand = $1, model = $2, year = $3, price = $4, kilometers_driven = $5, location = $6, image_url = $7 WHERE id = $8 RETURNING *',
      [brand, model, year, price, kilometers_driven, location, image_url, id]
    );
    
    res.json({
      message: 'Bike updated successfully',
      bike: result.rows[0]
    });
    
  } catch (error) {
    console.error('Update bike error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete bike (authenticated, owner only)
router.delete('/:id', authenticateToken, isOwner, async (req, res) => {
  try {
    const { id } = req.params;
    
    await req.app.locals.db.query('DELETE FROM bikes WHERE id = $1', [id]);
    
    res.json({ message: 'Bike deleted successfully' });
    
  } catch (error) {
    console.error('Delete bike error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

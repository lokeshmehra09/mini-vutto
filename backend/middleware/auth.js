const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const isOwner = async (req, res, next) => {
  try {
    const bikeId = req.params.id;
    const userId = req.user.id;
    
    // Check if bike exists and user is the owner
    const result = await req.app.locals.db.query(
      'SELECT seller_id FROM bikes WHERE id = $1',
      [bikeId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    
    if (result.rows[0].seller_id !== userId) {
      return res.status(403).json({ message: 'Access denied. You can only edit your own listings.' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authenticateToken, isOwner };




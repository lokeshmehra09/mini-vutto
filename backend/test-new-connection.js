require('dotenv').config({ path: './env.config' });
const db = require('./config/database');

console.log('=== TESTING NEW DATABASE CONNECTION ===\n');

console.log('🔧 CONNECTION DETAILS:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('');

// Test connection
db.query('SELECT current_database() as db_name, current_user as db_user, version() as db_version', (err, res) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
    db.end();
    return;
  }
  
  console.log('✅ Connected to database successfully!');
  console.log('Database name:', res.rows[0].db_name);
  console.log('Database user:', res.rows[0].db_user);
  console.log('PostgreSQL version:', res.rows[0].db_version.split(' ')[0]);
  console.log('');
  
  // Check users count
  db.query('SELECT COUNT(*) as total_users FROM users', (err, res) => {
    if (err) {
      console.log('❌ Error counting users:', err.message);
    } else {
      console.log('Total users in database:', res.rows[0].total_users);
    }
    
    // Check bikes count
    db.query('SELECT COUNT(*) as total_bikes FROM bikes', (err, res) => {
      if (err) {
        console.log('❌ Error counting bikes:', err.message);
      } else {
        console.log('Total bikes in database:', res.rows[0].total_bikes);
      }
      
      db.end();
    });
  });
});


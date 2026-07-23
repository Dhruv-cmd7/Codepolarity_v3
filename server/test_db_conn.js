const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/antigravity_academy';

console.log('Attempting to connect to MongoDB...');
console.log('URI:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB.');
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    console.log('Database Name:', mongoose.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR: Failed to connect to MongoDB.');
    console.error('Message:', err.message);
    process.exit(1);
  });

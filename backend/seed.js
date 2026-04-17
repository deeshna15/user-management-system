const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/user-management');

const importData = async () => {
  try {
    await User.deleteMany(); // Clear existing

    // Simple auto-generate password
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@system.com',
      password: 'Password123!',
      role: 'Admin'
    });
    
    await User.create({
      name: 'System Manager',
      email: 'manager@system.com',
      password: 'Password123!',
      role: 'Manager'
    });

    await User.create({
      name: 'Standard User',
      email: 'user@system.com',
      password: 'Password123!',
      role: 'User'
    });

    console.log('Data Imported. Includes: admin@system.com, manager@system.com, user@system.com (pass: Password123!)');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();

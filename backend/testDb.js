const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/user-management').then(async () => {
    const users = await User.find({}).select('+password');
    console.log(users);
    process.exit();
}).catch(console.error);

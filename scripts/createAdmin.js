require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        
        const existingAdmin = await User.findOne({
            $or: [
                { email: 'admin@coffee.com' },
                { username: 'admin' }
            ]
        });

        if (existingAdmin) {
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Existing user updated to admin role');
            } else {
                console.log('Admin user already exists');
            }
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
            username: 'admin_' + Date.now(), 
            email: 'admin@coffee.com',
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Username:', adminUser.username);
        console.log('Email:', adminUser.email);
        console.log('Password: admin123');
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdminUser();

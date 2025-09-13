const dotenv = require('dotenv');
const path = require('path');
const users = require('./users');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        const createdUsers = await Promise.all(
            users.map(async (user) => {
                const newUser = new User(user);
                return await newUser.save();
            })
        );

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
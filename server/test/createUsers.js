import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/UserSchema.js';
import connectDB from '../database/connectDB.js';


dotenv.config();

const usersToCreate = [
    {
        fullName: "John Doe",
        username: "johndoe",
        password: "password"
    },
    {
        fullName: "Mike Johnson",
        username: "mikejohnson",
        password: "password"
    },
    {
        fullName: "Sarah Wilson",
        username: "sarah",
        password: "password"
    },
    {
        fullName: "David Brown",
        username: "david",
        password: "password"
    }
];

const createUsers = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing users (optional - remove if you want to keep existing users)
        const deleteResult = await User.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing users`);

        // Create users
        const createdUsers = [];

        for (const userData of usersToCreate) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ username: userData.username });
                if (existingUser) {
                    console.log(`User ${userData.username} already exists, skipping...`);
                    continue;
                }

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);

                // Create user
                const newUser = new User({
                    fullName: userData.fullName,
                    username: userData.username,
                    password: hashedPassword,
                    profilePic: 'https://bestliness.com/wp-content/uploads/2023/07/cute-cat-dp-36.png'
                });

                await newUser.save();
                createdUsers.push({
                    id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username
                });

                console.log(`✅ Created user: ${userData.fullName} (${userData.username})`);
            } catch (error) {
                console.error(`❌ Error creating user ${userData.username}:`, error.message);
            }
        }

        console.log('\n📊 Summary:');
        console.log(`Total users to create: ${usersToCreate.length}`);
        console.log(`Successfully created: ${createdUsers.length}`);
        console.log(`Failed: ${usersToCreate.length - createdUsers.length}`);

        if (createdUsers.length > 0) {
            console.log('\n🎉 Created users:');
            createdUsers.forEach(user => {
                console.log(`   - ${user.fullName} (${user.username}) - ID: ${user.id}`);
            });
        }

    } catch (error) {
        console.error('❌ Error in createUsers script:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔒 Database connection closed');
        process.exit(0);
    }
};

// Run the script
createUsers();

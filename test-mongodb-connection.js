// Test MongoDB Connection Script
// Run this with: node test-mongodb-connection.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI not found in .env.local');
    console.log('Please add: MONGO_URI=your_connection_string');
    process.exit(1);
}

console.log('🔍 Testing MongoDB Connection...');
console.log('Connection String:', MONGO_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
};

mongoose.connect(MONGO_URI, options)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        console.log('Host:', mongoose.connection.host);
        console.log('Database:', mongoose.connection.name);
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ MongoDB Connection Failed!');
        console.error('Error:', error.message);
        
        if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
            console.log('\n📋 Troubleshooting Steps:');
            console.log('1. Check MongoDB Atlas Dashboard:');
            console.log('   - Go to https://cloud.mongodb.com');
            console.log('   - Verify your cluster is running (not paused)');
            console.log('   - Click "Resume" if cluster is paused');
            console.log('\n2. Check Network Access:');
            console.log('   - Go to Network Access in MongoDB Atlas');
            console.log('   - Click "Add IP Address"');
            console.log('   - Select "Allow Access from Anywhere" (0.0.0.0/0) for testing');
            console.log('   - Or add your current IP address');
            console.log('   - Wait 1-2 minutes after adding IP');
            console.log('\n3. Verify Connection String:');
            console.log('   - Go to your cluster in MongoDB Atlas');
            console.log('   - Click "Connect" → "Connect your application"');
            console.log('   - Copy the connection string');
            console.log('   - Make sure password is URL-encoded (@ = %40)');
            console.log('\n4. Check Internet Connection:');
            console.log('   - Ensure you have internet access');
            console.log('   - Check if firewall/proxy is blocking MongoDB');
        }
        
        process.exit(1);
    });


// Run this once to create your admin login: node seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const USERNAME = process.env.SEED_ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'changeme123';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const existing = await Admin.findOne({ username: USERNAME });
    if (existing) {
      console.log(`Admin "${USERNAME}" already exists. Skipping.`);
      process.exit(0);
    }

    await Admin.create({ username: USERNAME, password: PASSWORD });
    console.log(`Admin created successfully.`);
    console.log(`Username: ${USERNAME}`);
    console.log(`Password: ${PASSWORD}`);
    console.log(`(Change SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD in .env before running this if you want different credentials.)`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Bin  = require('./models/Bin');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iot-garbage-monitor';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await User.deleteMany({});
  await Bin.deleteMany({});

  // Create users
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
  });
  const worker1 = await User.create({
    name: 'Raj Kumar',
    email: 'worker@demo.com',
    password: 'worker123',
    role: 'worker',
  });
  const worker2 = await User.create({
    name: 'Priya Sharma',
    email: 'priya@demo.com',
    password: 'worker123',
    role: 'worker',
  });

  // Create bins
  const bins = [
    { binId: 'BIN-001', location: 'Main Street, Gate 1', fillLevel: 87, assignedWorker: worker1._id },
    { binId: 'BIN-002', location: 'Park Avenue, East Wing', fillLevel: 52, assignedWorker: worker1._id },
    { binId: 'BIN-003', location: 'Bus Terminal, Bay 3', fillLevel: 15, assignedWorker: worker2._id },
    { binId: 'BIN-004', location: 'Market Square, Block A', fillLevel: 91, assignedWorker: worker1._id },
    { binId: 'BIN-005', location: 'City Hospital, Entrance', fillLevel: 63, assignedWorker: worker2._id },
    { binId: 'BIN-006', location: 'Railway Station, Platform 2', fillLevel: 29, assignedWorker: null },
    { binId: 'BIN-007', location: 'School Road, Near Gate', fillLevel: 78, assignedWorker: worker2._id },
    { binId: 'BIN-008', location: 'Shopping Mall, Level 1', fillLevel: 44, assignedWorker: null },
  ];

  for (const b of bins) {
    await Bin.create(b);
  }

  console.log('✅ Seed complete!');
  console.log('Admin:  admin@demo.com  / admin123');
  console.log('Worker: worker@demo.com / worker123');
  console.log('Worker: priya@demo.com  / worker123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

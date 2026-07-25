const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const db = mongoose.connection.db;

  // Clear collections
  await Promise.all([
    db.collection('departments').deleteMany({}),
    db.collection('users').deleteMany({}),
    db.collection('vendors').deleteMany({}),
    db.collection('budgets').deleteMany({}),
  ]);
  console.log('🗑  Cleared existing data');

  // ── Departments ────────────────────────────────────────────
  await db.collection('departments').insertMany([
    { name: 'ICT Department',         code: 'ICT', hodName: 'Prof. Musa Garba',      isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Faculty of Engineering', code: 'ENG', hodName: 'Prof. Abubakar Sani',   isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Faculty of Sciences',    code: 'SCI', hodName: 'Prof. Ngozi Obi',       isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Library',                code: 'LIB', hodName: 'Mr. Ibrahim Tanko',     isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Registry',               code: 'REG', hodName: 'Mr. Ahmed Tanko',       isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Finance Department',     code: 'FIN', hodName: 'Mrs. Fatima Aliyu',     isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Works and Maintenance',  code: 'WRK', hodName: 'Engr. Bala Mohammed',   isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Medical Centre',         code: 'MED', hodName: 'Dr. Grace Okonkwo',     isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Student Affairs',        code: 'STA', hodName: 'Dr. Yusuf Adamu',       isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Procurement Unit',       code: 'PRO', hodName: 'Mr. Uche Okafor',       isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Vice Chancellor Office', code: 'VCO', hodName: 'Prof. Yakubu Ibrahim',  isActive: true, createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log('✅ Departments seeded');

  // Build dept lookup map
  const deptDocs = await db.collection('departments').find({}).toArray();
  const deptMap  = {};
  deptDocs.forEach((d) => { deptMap[d.code] = d._id; });

  // ── Users ──────────────────────────────────────────────────
  const hash = await bcrypt.hash('Password@123', 12);

  await db.collection('users').insertMany([
    {
      name:       'Dr. Amina Bello',
      email:      'requester@ksu.edu.ng',
      password:   hash,
      role:       'requester',
      department: deptMap['ICT'],
      staffId:    'KSU/STF/001',
      phone:      '08012345678',
      isActive:   true,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    },
    {
      name:       'Prof. Musa Garba',
      email:      'hod@ksu.edu.ng',
      password:   hash,
      role:       'hod',
      department: deptMap['ICT'],
      staffId:    'KSU/STF/002',
      phone:      '08023456789',
      isActive:   true,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    },
    {
      name:       'Mr. Uche Okafor',
      email:      'procurement@ksu.edu.ng',
      password:   hash,
      role:       'procurement',
      department: deptMap['PRO'],
      staffId:    'KSU/STF/003',
      phone:      '08034567890',
      isActive:   true,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    },
    {
      name:       'Mrs. Fatima Aliyu',
      email:      'finance@ksu.edu.ng',
      password:   hash,
      role:       'finance',
      department: deptMap['FIN'],
      staffId:    'KSU/STF/004',
      phone:      '08045678901',
      isActive:   true,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    },
    {
      name:       'Prof. Yakubu Ibrahim',
      email:      'vc@ksu.edu.ng',
      password:   hash,
      role:       'vc',
      department: deptMap['VCO'],
      staffId:    'KSU/STF/005',
      phone:      '08056789012',
      isActive:   true,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    },
    {
      name:       'System Administrator',
      email:      'admin@ksu.edu.ng',
      password:   hash,
      role:       'admin',
      department: null,
      staffId:    'KSU/STF/000',
      phone:      '08067890123',
      isActive:   true,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    },
  ]);
  console.log('✅ Users seeded — password: Password@123');

  // ── Vendors ────────────────────────────────────────────────
  await db.collection('vendors').insertMany([
    {
      name:        'Kaduna Global Supplies Ltd',
      email:       'info@kadunaglobal.com',
      phone:       '08011112222',
      location:    'Kaduna',
      address:     '12 Independence Way, Kaduna',
      rcNumber:    'RC123456',
      isVerified:  true,
      rating:      4.5,
      isActive:    true,
      createdAt:   new Date(),
      updatedAt:   new Date(),
    },
    {
      name:        'Northern Office Solutions',
      email:       'contact@northernoffice.com',
      phone:       '08022223333',
      location:    'Abuja',
      address:     '45 Wuse Zone 5, Abuja',
      rcNumber:    'RC234567',
      isVerified:  true,
      rating:      4.2,
      isActive:    true,
      createdAt:   new Date(),
      updatedAt:   new Date(),
    },
    {
      name:        'TechBridge Nigeria Ltd',
      email:       'sales@techbridge.ng',
      phone:       '08033334444',
      location:    'Lagos',
      address:     '78 Victoria Island, Lagos',
      rcNumber:    'RC345678',
      isVerified:  true,
      rating:      4.8,
      isActive:    true,
      createdAt:   new Date(),
      updatedAt:   new Date(),
    },
    {
      name:        'Sahel Procurement Services',
      email:       'info@sahelprocure.com',
      phone:       '08044445555',
      location:    'Kaduna',
      address:     '23 Ahmadu Bello Way, Kaduna',
      rcNumber:    'RC456789',
      isVerified:  true,
      rating:      3.9,
      isActive:    true,
      createdAt:   new Date(),
      updatedAt:   new Date(),
    },
    {
      name:        'Zaria General Merchants',
      email:       'zaria@merchants.com',
      phone:       '08055556666',
      location:    'Zaria',
      address:     '5 Tudun Wada Road, Zaria',
      rcNumber:    null,
      isVerified:  false,
      rating:      4.1,
      isActive:    true,
      createdAt:   new Date(),
      updatedAt:   new Date(),
    },
  ]);
  console.log('✅ Vendors seeded');

  // ── Budgets ────────────────────────────────────────────────
  const year = new Date().getFullYear();

  await db.collection('budgets').insertMany([
    { department: deptMap['ICT'], fiscalYear: year, amountAllocated: 8000000,  amountSpent: 4500000, amountCommitted: 1200000, createdAt: new Date(), updatedAt: new Date() },
    { department: deptMap['ENG'], fiscalYear: year, amountAllocated: 12000000, amountSpent: 3200000, amountCommitted: 2500000, createdAt: new Date(), updatedAt: new Date() },
    { department: deptMap['SCI'], fiscalYear: year, amountAllocated: 10000000, amountSpent: 1200000, amountCommitted: 0,       createdAt: new Date(), updatedAt: new Date() },
    { department: deptMap['LIB'], fiscalYear: year, amountAllocated: 5000000,  amountSpent: 0,       amountCommitted: 500000,  createdAt: new Date(), updatedAt: new Date() },
    { department: deptMap['REG'], fiscalYear: year, amountAllocated: 4000000,  amountSpent: 850000,  amountCommitted: 200000,  createdAt: new Date(), updatedAt: new Date() },
    { department: deptMap['WRK'], fiscalYear: year, amountAllocated: 15000000, amountSpent: 750000,  amountCommitted: 5000000, createdAt: new Date(), updatedAt: new Date() },
    { department: deptMap['MED'], fiscalYear: year, amountAllocated: 6000000,  amountSpent: 1100000, amountCommitted: 800000,  createdAt: new Date(), updatedAt: new Date() },
    { department: deptMap['STA'], fiscalYear: year, amountAllocated: 3500000,  amountSpent: 400000,  amountCommitted: 0,       createdAt: new Date(), updatedAt: new Date() },
    { department: deptMap['BUR'], fiscalYear: year, amountAllocated: 2000000,  amountSpent: 200000,  amountCommitted: 0,       createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log('✅ Budgets seeded');

  await mongoose.disconnect();
  console.log('');
  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('Login credentials:');
  console.log('  requester@ksu.edu.ng  — Password@123');
  console.log('  hod@ksu.edu.ng        — Password@123');
  console.log('  procurement@ksu.edu.ng — Password@123');
  console.log('  finance@ksu.edu.ng    — Password@123');
  console.log('  vc@ksu.edu.ng         — Password@123');
  console.log('  admin@ksu.edu.ng      — Password@123');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});

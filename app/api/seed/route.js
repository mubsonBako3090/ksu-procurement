import { connectDB }  from '@/lib/db';
import User           from '@/models/User';
import Department     from '@/models/Department';
import Vendor         from '@/models/Vendor';
import Budget         from '@/models/Budget';
import bcrypt         from 'bcryptjs';

// ── Safety key — only runs if you pass ?key=ksu_seed_2024 ──────────────────
const SEED_KEY = process.env.SEED_SECRET || 'ksu_seed_2024';

export async function GET(request) {
  try {
    // Protect the route with a secret key
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== SEED_KEY) {
      return Response.json(
        { success: false, message: 'Unauthorized. Wrong seed key.' },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if already seeded
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return Response.json({
        success: true,
        message: `Database already has ${existingUsers} users. Skipping seed.`,
        alreadySeeded: true,
      });
    }

    // ── Departments ──────────────────────────────────────────────────────────
    const departmentData = [
      { name: 'ICT Department',         code: 'ICT', hodName: 'Prof. Musa Garba',      isActive: true },
      { name: 'Faculty of Engineering', code: 'ENG', hodName: 'Prof. Abubakar Sani',   isActive: true },
      { name: 'Faculty of Sciences',    code: 'SCI', hodName: 'Prof. Ngozi Obi',       isActive: true },
      { name: 'Library',                code: 'LIB', hodName: 'Mr. Ibrahim Tanko',     isActive: true },
      { name: 'Registry',               code: 'REG', hodName: 'Mr. Ahmed Tanko',       isActive: true },
      { name: 'Finance Department',     code: 'FIN', hodName: 'Mrs. Fatima Aliyu',     isActive: true },
      { name: 'Works and Maintenance',  code: 'WRK', hodName: 'Engr. Bala Mohammed',  isActive: true },
      { name: 'Medical Centre',         code: 'MED', hodName: 'Dr. Grace Okonkwo',    isActive: true },
      { name: 'Student Affairs',        code: 'STA', hodName: 'Dr. Yusuf Adamu',      isActive: true },
      { name: 'Procurement Unit',       code: 'PRO', hodName: 'Mr. Uche Okafor',      isActive: true },
      { name: 'Vice Chancellor Office', code: 'VCO', hodName: 'Prof. Yakubu Ibrahim', isActive: true },
    ];

    const departments = await Department.insertMany(departmentData);

    // Build lookup map
    const deptMap = {};
    departments.forEach((d) => { deptMap[d.code] = d._id; });

    console.log('✅ Departments seeded:', departments.length);

    // ── Users ────────────────────────────────────────────────────────────────
    const hash = await bcrypt.hash('Password@123', 12);

    const userData = [
      {
        name:       'Dr. Amina Bello',
        email:      'requester@ksu.edu.ng',
        password:   hash,
        role:       'requester',
        department: deptMap['ICT'],
        staffId:    'KSU/STF/001',
        phone:      '08012345678',
        isActive:   true,
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
      },
    ];

    // Use create one by one so the pre-save hook (password hashing) runs
    // We already hashed above, so use insertMany directly to avoid double-hash
    const users = await User.insertMany(userData);
    console.log('✅ Users seeded:', users.length);

    // ── Vendors ──────────────────────────────────────────────────────────────
    const vendorData = [
      {
        name:       'Kaduna Global Supplies Ltd',
        email:      'info@kadunaglobal.com',
        phone:      '08011112222',
        location:   'Kaduna',
        address:    '12 Independence Way, Kaduna',
        rcNumber:   'RC123456',
        isVerified: true,
        rating:     4.5,
        isActive:   true,
      },
      {
        name:       'Northern Office Solutions',
        email:      'contact@northernoffice.com',
        phone:      '08022223333',
        location:   'Abuja',
        address:    '45 Wuse Zone 5, Abuja',
        rcNumber:   'RC234567',
        isVerified: true,
        rating:     4.2,
        isActive:   true,
      },
      {
        name:       'TechBridge Nigeria Ltd',
        email:      'sales@techbridge.ng',
        phone:      '08033334444',
        location:   'Lagos',
        address:    '78 Victoria Island, Lagos',
        rcNumber:   'RC345678',
        isVerified: true,
        rating:     4.8,
        isActive:   true,
      },
      {
        name:       'Sahel Procurement Services',
        email:      'info@sahelprocure.com',
        phone:      '08044445555',
        location:   'Kaduna',
        address:    '23 Ahmadu Bello Way, Kaduna',
        rcNumber:   'RC456789',
        isVerified: true,
        rating:     3.9,
        isActive:   true,
      },
      {
        name:       'Zaria General Merchants',
        email:      'zaria@merchants.com',
        phone:      '08055556666',
        location:   'Zaria',
        address:    '5 Tudun Wada Road, Zaria',
        rcNumber:   null,
        isVerified: false,
        rating:     4.1,
        isActive:   true,
      },
    ];

    const vendors = await Vendor.insertMany(vendorData);
    console.log('✅ Vendors seeded:', vendors.length);

    // ── Budgets ──────────────────────────────────────────────────────────────
    const year = new Date().getFullYear();

    const budgetData = [
      { department: deptMap['ICT'], fiscalYear: year, amountAllocated: 8000000,  amountSpent: 0, amountCommitted: 0 },
      { department: deptMap['ENG'], fiscalYear: year, amountAllocated: 12000000, amountSpent: 0, amountCommitted: 0 },
      { department: deptMap['SCI'], fiscalYear: year, amountAllocated: 10000000, amountSpent: 0, amountCommitted: 0 },
      { department: deptMap['LIB'], fiscalYear: year, amountAllocated: 5000000,  amountSpent: 0, amountCommitted: 0 },
      { department: deptMap['REG'], fiscalYear: year, amountAllocated: 4000000,  amountSpent: 0, amountCommitted: 0 },
      { department: deptMap['WRK'], fiscalYear: year, amountAllocated: 15000000, amountSpent: 0, amountCommitted: 0 },
      { department: deptMap['MED'], fiscalYear: year, amountAllocated: 6000000,  amountSpent: 0, amountCommitted: 0 },
      { department: deptMap['STA'], fiscalYear: year, amountAllocated: 3500000,  amountSpent: 0, amountCommitted: 0 },
      { department: deptMap['FIN'], fiscalYear: year, amountAllocated: 2000000,  amountSpent: 0, amountCommitted: 0 },
    ];

    const budgets = await Budget.insertMany(budgetData);
    console.log('✅ Budgets seeded:', budgets.length);

    // ── Done ─────────────────────────────────────────────────────────────────
    return Response.json({
      success: true,
      message: 'Database seeded successfully!',
      summary: {
        departments: departments.length,
        users:       users.length,
        vendors:     vendors.length,
        budgets:     budgets.length,
      },
      loginCredentials: [
        { role: 'Requester',   email: 'requester@ksu.edu.ng',   password: 'Password@123' },
        { role: 'HOD',         email: 'hod@ksu.edu.ng',         password: 'Password@123' },
        { role: 'Procurement', email: 'procurement@ksu.edu.ng', password: 'Password@123' },
        { role: 'Finance',     email: 'finance@ksu.edu.ng',     password: 'Password@123' },
        { role: 'VC',          email: 'vc@ksu.edu.ng',          password: 'Password@123' },
        { role: 'Admin',       email: 'admin@ksu.edu.ng',       password: 'Password@123' },
      ],
    });

  } catch (err) {
    console.error('Seed error:', err);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

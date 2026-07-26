import { connectDB }  from '@/lib/db';
import User           from '@/models/User';
import Department     from '@/models/Department';
import bcrypt         from 'bcryptjs';
import { successResponse, errorResponse, handleError } from '@/utils/apiResponse';

export async function GET() {
  try {
    await connectDB();
    const count = await User.countDocuments();
    return successResponse(
      { setupRequired: count === 0 },
      'Setup status checked'
    );
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request) {
  try {
    await connectDB();

    // Only allow if no users exist yet
    const count = await User.countDocuments();
    if (count > 0) {
      return errorResponse(
        'Setup already completed. System already has users.',
        403
      );
    }

    const { name, email, password, phone, staffId } = await request.json();

    if (!name || !email || !password) {
      return errorResponse('Name, email and password are required', 400);
    }

    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters', 400);
    }

    // Create departments first
    const departmentData = [
      { name: 'ICT Department',         code: 'ICT', hodName: 'To be assigned', isActive: true },
      { name: 'Faculty of Engineering', code: 'ENG', hodName: 'To be assigned', isActive: true },
      { name: 'Faculty of Sciences',    code: 'SCI', hodName: 'To be assigned', isActive: true },
      { name: 'Library',                code: 'LIB', hodName: 'To be assigned', isActive: true },
      { name: 'Registry',               code: 'REG', hodName: 'To be assigned', isActive: true },
      { name: 'Finance Department',     code: 'FIN', hodName: 'To be assigned', isActive: true },
      { name: 'Works and Maintenance',  code: 'WRK', hodName: 'To be assigned', isActive: true },
      { name: 'Medical Centre',         code: 'MED', hodName: 'To be assigned', isActive: true },
      { name: 'Student Affairs',        code: 'STA', hodName: 'To be assigned', isActive: true },
      { name: 'Procurement Unit',       code: 'PRO', hodName: 'To be assigned', isActive: true },
      { name: 'Vice Chancellor Office', code: 'VCO', hodName: 'To be assigned', isActive: true },
      { name: 'Bursary',                code: 'BUR', hodName: 'To be assigned', isActive: true },
    ];

    const existingDepts = await Department.countDocuments();
    if (existingDepts === 0) {
      await Department.insertMany(departmentData);
    }

    // Create admin user
    const hash = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name,
      email:      email.toLowerCase().trim(),
      password:   hash,
      role:       'admin',
      department: null,
      phone:      phone || '',
      staffId:    staffId || 'KSU/ADM/001',
      isActive:   true,
    });

    const { password: _, ...safeUser } = admin.toObject();

    return successResponse(
      { user: safeUser },
      'Admin account created successfully! You can now log in.',
      201
    );

  } catch (err) {
    return handleError(err);
  }
        }

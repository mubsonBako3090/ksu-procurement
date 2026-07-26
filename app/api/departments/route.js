import { requireAuth } from '@/lib/auth';
import Department      from '@/models/Department';
import { connectDB }   from '@/lib/db';
import {
  successResponse,
  handleError,
} from '@/utils/apiResponse';

export async function GET(request) {
  try {
    requireAuth(request);
    await connectDB();
    const departments = await Department
      .find({ isActive: true })
      .sort({ name: 1 });
    return successResponse(departments, 'Departments fetched');
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request) {
  try {
    requireAuth(request);
    await connectDB();
    const body = await request.json();
    const dept = await Department.create(body);
    return successResponse(dept, 'Department created', 201);
  } catch (err) {
    return handleError(err);
  }
}

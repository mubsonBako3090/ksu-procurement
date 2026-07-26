import { connectDB }  from '@/lib/db';
import Department     from '@/models/Department';
import { successResponse, handleError } from '@/utils/apiResponse';

export async function GET() {
  try {
    await connectDB();
    const departments = await Department
      .find({ isActive: true })
      .select('_id name code')
      .sort({ name: 1 });
    return successResponse(departments, 'Departments fetched');
  } catch (err) {
    return handleError(err);
  }
}

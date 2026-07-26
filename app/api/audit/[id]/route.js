import { requireAuth, requireRole } from '@/lib/auth';
import AuditLog      from '@/models/AuditLog';
import { connectDB } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  handleError,
} from '@/utils/apiResponse';

export async function GET(request, { params }) {
  try {
    requireAuth(request);
    await connectDB();

    const log = await AuditLog.findById(params.id)
      .populate('user',        'name role email')
      .populate('requisition', 'reqNumber title');

    if (!log) return errorResponse('Audit log not found', 404);
    return successResponse(log, 'Audit log fetched');
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request, { params }) {
  try {
    requireRole(request, 'admin');
    await connectDB();

    const log = await AuditLog.findByIdAndDelete(params.id);
    if (!log) return errorResponse('Audit log not found', 404);
    return successResponse(null, 'Audit log deleted');
  } catch (err) {
    return handleError(err);
  }
}

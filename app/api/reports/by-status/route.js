export const dynamic = "force-dynamic";
import { requireAuth }  from '@/lib/auth';
import { getByStatus }  from '@/services/report.service';
import { successResponse, handleError } from '@/utils/apiResponse';

export async function GET(request) {
  try {
      requireAuth(request);
          const data = await getByStatus();
              return successResponse(data, 'Status report fetched');
                } catch (err) {
                    return handleError(err);
                      }
                      }

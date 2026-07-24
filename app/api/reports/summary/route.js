export const dynamic = "force-dynamic";
import { requireAuth }  from '@/lib/auth';
import { getSummary }   from '@/services/report.service';
import { successResponse, handleError } from '@/utils/apiResponse';

export async function GET(request) {
  try {
      requireAuth(request);
          const { searchParams } = new URL(request.url);
              const data = await getSummary(searchParams.get('year'));
                  return successResponse(data, 'Summary fetched');
                    } catch (err) {
                        return handleError(err);
                          }
                          }

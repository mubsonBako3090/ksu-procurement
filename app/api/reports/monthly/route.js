export const dynamic = "force-dynamic";


import { requireAuth }  from '@/lib/auth';
import { getMonthly }   from '@/services/report.service';
import { successResponse, handleError } from '@/utils/apiResponse';

export async function GET(request) {
  try {
      requireAuth(request);
          const { searchParams } = new URL(request.url);
              const data = await getMonthly(searchParams.get('year'));
                  return successResponse(data, 'Monthly report fetched');
                    } catch (err) {
                        return handleError(err);
                          }
                          }

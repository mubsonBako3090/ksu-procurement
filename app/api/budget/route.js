import { requireAuth, requireRole } from '@/lib/auth';
import {
  getAllBudgets,
  createBudget,
  getBudgetSummary,
} from '@/services/budget.service';
import {
  successResponse,
  handleError,
} from '@/utils/apiResponse';

export async function GET(request) {
  try {
    requireAuth(request);
    const { searchParams } = new URL(request.url);
    const year    = searchParams.get('year');
    const summary = searchParams.get('summary') === 'true';
    const data    = summary
      ? await getBudgetSummary(year)
      : await getAllBudgets(year);
    return successResponse(data, 'Budget data fetched');
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request) {
  try {
    requireRole(request, 'finance', 'admin');
    const body = await request.json();
    const data = await createBudget(body);
    return successResponse(data, 'Budget created', 201);
  } catch (err) {
    return handleError(err);
  }
}

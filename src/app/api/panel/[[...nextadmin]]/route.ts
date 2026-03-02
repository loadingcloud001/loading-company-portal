import { createHandler } from '@premieroctet/next-admin/appHandler';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nextAdminOptions, ADMIN_API_BASE_PATH } from '@/lib/next-admin';

const { run } = createHandler({
  apiBasePath: ADMIN_API_BASE_PATH,
  prisma,
  options: nextAdminOptions,
  onRequest: async (req) => {
    // ── Auth guard: only admin users can use the panel ──
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/portal-auth-token=([^;]+)/);

    if (!match) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      const user = JSON.parse(decodeURIComponent(match[1]));
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }
    } catch {
      return Response.json({ error: 'Invalid auth token' }, { status: 401 });
    }

    // Auth passed — continue to handler
  },
});

/**
 * Wrapper to adapt Next.js 16 optional catch-all params
 * (`nextadmin?: string[]`) to next-admin's expected type (`nextadmin: string[]`).
 */
function wrapHandler(handler: typeof run) {
  return (
    req: NextRequest,
    ctx: { params: Promise<{ nextadmin?: string[] }> }
  ) => {
    const adaptedCtx = {
      params: ctx.params.then((p) => ({
        nextadmin: p.nextadmin ?? [],
      })),
    };
    return handler(req, adaptedCtx);
  };
}

export const GET = wrapHandler(run);
export const POST = wrapHandler(run);
export const DELETE = wrapHandler(run);

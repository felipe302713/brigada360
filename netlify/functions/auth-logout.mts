import type { Context } from '@netlify/functions';

export default async (_req: Request, _context: Context) => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0',
    },
  });
};

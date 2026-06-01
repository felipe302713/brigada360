import type { Context } from '@netlify/functions';
import { getAuthUser } from './auth-me.mts';
import { getDB } from './db.mts';

export default async (req: Request, _context: Context) => {
  const auth = getAuthUser(req);
  if (!auth) return Response.json({ message: 'Não autenticado' }, { status: 401 });
  if (auth.perfil !== 'ADMIN') return Response.json({ message: 'Sem permissão' }, { status: 403 });

  const db = await getDB();

  if (req.method === 'GET') {
    const audits = db.auditoria.map(a => ({
      ...a,
      usuario: db.usuarios.find(u => u.id === a.usuario_id),
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return Response.json(audits);
  }

  return new Response('Method not allowed', { status: 405 });
};

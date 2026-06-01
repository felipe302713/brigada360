import type { Context } from '@netlify/functions';
import jwt from 'jsonwebtoken';
import { getDB } from './db.mts';

const SECRET = process.env.JWT_SECRET || 'brigada360-dev-secret-key';

export function getAuthUser(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;
  try {
    return jwt.verify(match[1], SECRET) as { id: string; perfil: string };
  } catch {
    return null;
  }
}

export default async (req: Request, _context: Context) => {
  const auth = getAuthUser(req);
  if (!auth) return Response.json({ message: 'Não autenticado' }, { status: 401 });

  const db = await getDB();
  const user = db.usuarios.find(u => u.id === auth.id && u.ativo);
  if (!user) return Response.json({ message: 'Usuário não encontrado' }, { status: 401 });

  return Response.json({
    user: { id: user.id, nome_completo: user.nome_completo, perfil: user.perfil, usuario_login: user.usuario_login }
  });
};

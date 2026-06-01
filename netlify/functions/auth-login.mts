import type { Context } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from './db.mts';

const SECRET = process.env.JWT_SECRET || 'brigada360-dev-secret-key';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { usuario, senha } = await req.json();
  if (!usuario || !senha) return Response.json({ message: 'Usuário e senha obrigatórios' }, { status: 400 });

  const db = await getDB();
  const user = db.usuarios.find(u => u.usuario_login === usuario && u.ativo);
  if (!user) return Response.json({ message: 'Credenciais inválidas' }, { status: 401 });

  const valid = bcrypt.compareSync(senha, user.senha_hash);
  if (!valid) return Response.json({ message: 'Credenciais inválidas' }, { status: 401 });

  user.ultimo_acesso = new Date().toISOString();

  const token = jwt.sign({ id: user.id, perfil: user.perfil }, SECRET, { expiresIn: '8h' });
  const { senha_hash, ...safeUser } = user;

  return Response.json(
    { user: { id: safeUser.id, nome_completo: safeUser.nome_completo, perfil: safeUser.perfil, usuario_login: safeUser.usuario_login } },
    {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.NETLIFY ? '; Secure' : ''}`,
      },
    }
  );
};

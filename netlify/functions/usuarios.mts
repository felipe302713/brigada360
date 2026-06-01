import type { Context } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { getAuthUser } from './auth-me.mts';
import { getDB, uuid, resetDB } from './db.mts';

const PERFIL_SENHAS: Record<string, string> = { ADMIN: 'admin', LIDER: 'lider', BOMBEIRO: 'bombeiro', BRIGADISTA: 'brigadista', SOCORRISTA: 'socorrista' };

export default async (req: Request, _context: Context) => {
  const auth = getAuthUser(req);
  if (!auth) return Response.json({ message: 'Não autenticado' }, { status: 401 });

  const db = await getDB();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action');

  if (action === 'restore-demo') {
    if (auth.perfil !== 'ADMIN') return Response.json({ message: 'Sem permissão' }, { status: 403 });
    await resetDB();
    return Response.json({ ok: true });
  }

  if (req.method === 'GET') {
    if (id) {
      const u = db.usuarios.find(u => u.id === id);
      if (!u) return Response.json({ message: 'Não encontrado' }, { status: 404 });
      const { senha_hash, ...safe } = u;
      return Response.json(safe);
    }
    return Response.json(db.usuarios.map(({ senha_hash, ...u }) => u));
  }

  if (auth.perfil !== 'ADMIN') return Response.json({ message: 'Sem permissão' }, { status: 403 });

  if (req.method === 'POST') {
    if (id && action === 'reset-password') {
      const user = db.usuarios.find(u => u.id === id);
      if (!user) return Response.json({ message: 'Não encontrado' }, { status: 404 });
      const defaultPw = PERFIL_SENHAS[user.perfil] || user.usuario_login;
      user.senha_hash = bcrypt.hashSync(defaultPw, 10);
      user.updated_at = new Date().toISOString();
      db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'reset_senha', entidade: 'usuarios', entidade_id: id, dados_anteriores: null, dados_novos: null, created_at: new Date().toISOString() });
      return Response.json({ ok: true });
    }

    const data = await req.json();
    if (!data.nome_completo || !data.usuario_login) return Response.json({ message: 'Nome e login obrigatórios' }, { status: 400 });
    if (db.usuarios.some(u => u.usuario_login === data.usuario_login)) return Response.json({ message: 'Login já existe' }, { status: 400 });

    const newUser = {
      id: uuid(), ...data,
      senha_hash: bcrypt.hashSync(data.senha || data.usuario_login, 10),
      ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    delete newUser.senha;
    db.usuarios.push(newUser);
    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'criar', entidade: 'usuarios', entidade_id: newUser.id, dados_anteriores: null, dados_novos: { nome: newUser.nome_completo }, created_at: new Date().toISOString() });
    const { senha_hash, ...safe } = newUser;
    return Response.json(safe, { status: 201 });
  }

  if (req.method === 'PUT' && id) {
    const user = db.usuarios.find(u => u.id === id);
    if (!user) return Response.json({ message: 'Não encontrado' }, { status: 404 });
    const data = await req.json();
    const prev = { ...user };
    Object.assign(user, data, { updated_at: new Date().toISOString() });
    if (data.senha) { user.senha_hash = bcrypt.hashSync(data.senha, 10); delete user.senha; }
    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'editar', entidade: 'usuarios', entidade_id: id, dados_anteriores: { nome: prev.nome_completo }, dados_novos: { nome: user.nome_completo }, created_at: new Date().toISOString() });
    const { senha_hash, ...safe } = user;
    return Response.json(safe);
  }

  if (req.method === 'DELETE' && id) {
    const user = db.usuarios.find(u => u.id === id);
    if (!user) return Response.json({ message: 'Não encontrado' }, { status: 404 });
    user.ativo = false;
    user.updated_at = new Date().toISOString();
    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'inativar', entidade: 'usuarios', entidade_id: id, dados_anteriores: null, dados_novos: null, created_at: new Date().toISOString() });
    return Response.json({ ok: true });
  }

  return new Response('Method not allowed', { status: 405 });
};

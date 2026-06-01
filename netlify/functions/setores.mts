import type { Context } from '@netlify/functions';
import { getAuthUser } from './auth-me.mts';
import { getDB, uuid } from './db.mts';

export default async (req: Request, _context: Context) => {
  const auth = getAuthUser(req);
  if (!auth) return Response.json({ message: 'Não autenticado' }, { status: 401 });
  const db = await getDB();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (req.method === 'GET') {
    if (id) return Response.json(db.setores.find(s => s.id === id) || null);
    return Response.json(db.setores);
  }
  if (auth.perfil !== 'ADMIN') return Response.json({ message: 'Sem permissão' }, { status: 403 });

  if (req.method === 'POST') {
    const data = await req.json();
    const item = { id: uuid(), ...data, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    db.setores.push(item);
    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'criar', entidade: 'setores', entidade_id: item.id, dados_anteriores: null, dados_novos: { nome: item.nome }, created_at: new Date().toISOString() });
    return Response.json(item, { status: 201 });
  }
  if (req.method === 'PUT' && id) {
    const item = db.setores.find(s => s.id === id);
    if (!item) return Response.json({ message: 'Não encontrado' }, { status: 404 });
    const data = await req.json();
    Object.assign(item, data, { updated_at: new Date().toISOString() });
    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'editar', entidade: 'setores', entidade_id: id, dados_anteriores: null, dados_novos: { nome: item.nome }, created_at: new Date().toISOString() });
    return Response.json(item);
  }
  if (req.method === 'DELETE' && id) {
    const item = db.setores.find(s => s.id === id);
    if (item) { item.ativo = false; item.updated_at = new Date().toISOString(); }
    return Response.json({ ok: true });
  }
  return new Response('Method not allowed', { status: 405 });
};

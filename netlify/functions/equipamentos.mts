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
    if (id) return Response.json(db.equipamentos.find(e => e.id === id) || null);
    return Response.json(db.equipamentos.filter(e => e.ativo));
  }
  if (auth.perfil !== 'ADMIN') return Response.json({ message: 'Sem permissão' }, { status: 403 });

  if (req.method === 'POST') {
    const data = await req.json();
    const item = { id: uuid(), ...data, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (item.data_vencimento) {
      const days = Math.ceil((new Date(item.data_vencimento).getTime() - Date.now()) / 86400000);
      if (days < 0) item.status = 'vencido';
      else if (days <= 30) item.status = 'proximo_vencimento';
      else item.status = 'regular';
    }
    db.equipamentos.push(item);
    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'criar', entidade: 'equipamentos', entidade_id: item.id, dados_anteriores: null, dados_novos: { codigo: item.codigo }, created_at: new Date().toISOString() });
    return Response.json(item, { status: 201 });
  }
  if (req.method === 'PUT' && id) {
    const item = db.equipamentos.find(e => e.id === id);
    if (!item) return Response.json({ message: 'Não encontrado' }, { status: 404 });
    const data = await req.json();
    Object.assign(item, data, { updated_at: new Date().toISOString() });
    if (item.data_vencimento) {
      const days = Math.ceil((new Date(item.data_vencimento).getTime() - Date.now()) / 86400000);
      if (days < 0) item.status = 'vencido';
      else if (days <= 30) item.status = 'proximo_vencimento';
      else item.status = 'regular';
    }
    return Response.json(item);
  }
  if (req.method === 'DELETE' && id) {
    const item = db.equipamentos.find(e => e.id === id);
    if (item) { item.ativo = false; item.updated_at = new Date().toISOString(); }
    return Response.json({ ok: true });
  }
  return new Response('Method not allowed', { status: 405 });
};

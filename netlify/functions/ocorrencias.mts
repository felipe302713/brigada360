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
    if (id) return Response.json(db.ocorrencias.find(o => o.id === id) || null);
    return Response.json(db.ocorrencias);
  }

  if (req.method === 'POST') {
    const data = await req.json();
    const year = new Date().getFullYear();
    const count = db.ocorrencias.filter(o => o.numero.startsWith(`OC-${year}`)).length + 1;
    const numero = `OC-${year}-${String(count).padStart(3, '0')}`;
    const item = {
      id: uuid(), numero, ...data,
      responsavel_registro_id: auth.id,
      status: data.status || 'aberta',
      data_hora_abertura: new Date().toISOString(),
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    db.ocorrencias.push(item);
    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'criar', entidade: 'ocorrencias', entidade_id: item.id, dados_anteriores: null, dados_novos: { numero }, created_at: new Date().toISOString() });
    return Response.json(item, { status: 201 });
  }

  if (req.method === 'PUT' && id) {
    const item = db.ocorrencias.find(o => o.id === id);
    if (!item) return Response.json({ message: 'Não encontrado' }, { status: 404 });
    const data = await req.json();
    const prevStatus = item.status;
    Object.assign(item, data, { updated_at: new Date().toISOString() });
    if (data.status === 'resolvida') item.data_hora_resolucao = new Date().toISOString();
    if (data.status && data.status !== prevStatus) {
      db.ocorrencia_historicos.push({ id: uuid(), ocorrencia_id: id, usuario_id: auth.id, status_anterior: prevStatus, status_novo: data.status, observacao: data.observacao_status || '', created_at: new Date().toISOString() });
    }
    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'editar', entidade: 'ocorrencias', entidade_id: id, dados_anteriores: { status: prevStatus }, dados_novos: { status: item.status }, created_at: new Date().toISOString() });
    return Response.json(item);
  }

  return new Response('Method not allowed', { status: 405 });
};

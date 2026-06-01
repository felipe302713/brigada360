import type { Context } from '@netlify/functions';
import { getAuthUser } from './auth-me.mts';
import { getDB, uuid } from './db.mts';

export default async (req: Request, _context: Context) => {
  const auth = getAuthUser(req);
  if (!auth) return Response.json({ message: 'Não autenticado' }, { status: 401 });
  const db = await getDB();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action');

  if (req.method === 'GET') {
    if (id) {
      const r = db.rondas.find(r => r.id === id);
      if (!r) return Response.json({ message: 'Não encontrado' }, { status: 404 });
      return Response.json({ ...r, responsavel: db.usuarios.find(u => u.id === r.responsavel_id) });
    }
    return Response.json(db.rondas.map(r => ({
      ...r,
      responsavel: db.usuarios.find(u => u.id === r.responsavel_id),
    })));
  }

  if (req.method === 'POST') {
    if (id && action === 'iniciar') {
      const r = db.rondas.find(r => r.id === id);
      if (!r) return Response.json({ message: 'Não encontrado' }, { status: 404 });
      r.status = 'em_andamento';
      r.responsavel_id = r.responsavel_id || auth.id;
      r.data_inicio_execucao = new Date().toISOString();
      r.updated_at = new Date().toISOString();
      db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'iniciar_ronda', entidade: 'rondas', entidade_id: id, dados_anteriores: null, dados_novos: null, created_at: new Date().toISOString() });
      return Response.json(r);
    }

    if (id && action === 'finalizar') {
      const r = db.rondas.find(r => r.id === id);
      if (!r) return Response.json({ message: 'Não encontrado' }, { status: 404 });
      const respostas = db.ronda_respostas.filter(rr => rr.ronda_id === id);
      const hasIssue = respostas.some(rr => rr.resultado === 'atencao' || rr.resultado === 'critico');
      r.status = hasIssue ? 'concluida_com_pendencia' : 'concluida';
      r.data_fim_execucao = new Date().toISOString();
      r.percentual_conclusao = 100;
      r.updated_at = new Date().toISOString();
      db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'finalizar_ronda', entidade: 'rondas', entidade_id: id, dados_anteriores: null, dados_novos: { status: r.status }, created_at: new Date().toISOString() });
      return Response.json(r);
    }

    const data = await req.json();
    const item = { id: uuid(), ...data, status: 'pendente', percentual_conclusao: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    db.rondas.push(item);
    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'criar', entidade: 'rondas', entidade_id: item.id, dados_anteriores: null, dados_novos: { nome: item.nome }, created_at: new Date().toISOString() });
    return Response.json(item, { status: 201 });
  }

  if (req.method === 'PUT' && id) {
    const item = db.rondas.find(r => r.id === id);
    if (!item) return Response.json({ message: 'Não encontrado' }, { status: 404 });
    const data = await req.json();
    Object.assign(item, data, { updated_at: new Date().toISOString() });
    return Response.json(item);
  }

  return new Response('Method not allowed', { status: 405 });
};

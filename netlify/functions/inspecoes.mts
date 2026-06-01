import type { Context } from '@netlify/functions';
import { getAuthUser } from './auth-me.mts';
import { getDB, uuid } from './db.mts';

export default async (req: Request, _context: Context) => {
  const auth = getAuthUser(req);
  if (!auth) return Response.json({ message: 'Não autenticado' }, { status: 401 });
  const db = await getDB();

  if (req.method === 'GET') {
    const inspecoes = db.inspecoes_equipamentos.map(i => ({
      ...i,
      responsavel: db.usuarios.find(u => u.id === i.responsavel_id),
      equipamento: db.equipamentos.find(e => e.id === i.equipamento_id),
    }));
    return Response.json(inspecoes);
  }

  if (req.method === 'POST') {
    const data = await req.json();
    const item = {
      id: uuid(), ...data,
      responsavel_id: data.responsavel_id || auth.id,
      data_hora_inspecao: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    db.inspecoes_equipamentos.push(item);

    const equip = db.equipamentos.find(e => e.id === data.equipamento_id);
    if (equip) {
      equip.data_ultima_inspecao = new Date().toISOString().split('T')[0];
      if (data.resultado === 'em_manutencao') equip.status = 'em_manutencao';
      equip.updated_at = new Date().toISOString();
    }

    db.auditoria.push({ id: uuid(), usuario_id: auth.id, acao: 'inspecao', entidade: 'equipamentos', entidade_id: data.equipamento_id, dados_anteriores: null, dados_novos: { resultado: data.resultado }, created_at: new Date().toISOString() });
    return Response.json(item, { status: 201 });
  }

  return new Response('Method not allowed', { status: 405 });
};

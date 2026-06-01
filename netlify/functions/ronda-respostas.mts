import type { Context } from '@netlify/functions';
import { getAuthUser } from './auth-me.mts';
import { getDB, uuid } from './db.mts';

export default async (req: Request, _context: Context) => {
  const auth = getAuthUser(req);
  if (!auth) return Response.json({ message: 'Não autenticado' }, { status: 401 });
  const db = await getDB();
  const url = new URL(req.url);
  const rondaId = url.searchParams.get('rondaId');

  if (req.method === 'GET') {
    if (!rondaId) return Response.json([]);
    return Response.json(db.ronda_respostas.filter(r => r.ronda_id === rondaId));
  }

  if (req.method === 'POST') {
    const data = await req.json();
    const existing = db.ronda_respostas.find(r => r.ronda_id === data.ronda_id && r.checklist_item_id === data.checklist_item_id);
    if (existing) {
      Object.assign(existing, data, { updated_at: new Date().toISOString() });
      return Response.json(existing);
    }
    const item = { id: uuid(), ...data, data_hora_verificacao: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    db.ronda_respostas.push(item);

    const ronda = db.rondas.find(r => r.id === data.ronda_id);
    if (ronda) {
      const checklist = db.checklists.find(c => c.id === ronda.checklist_id);
      if (checklist) {
        const cats = db.checklist_categorias.filter(c => c.checklist_id === checklist.id);
        const totalItems = cats.reduce((sum, cat) => sum + db.checklist_itens.filter(i => i.categoria_id === cat.id && i.ativo).length, 0);
        const answered = db.ronda_respostas.filter(r => r.ronda_id === data.ronda_id).length;
        ronda.percentual_conclusao = totalItems > 0 ? Math.round((answered / totalItems) * 100) : 0;
      }
    }

    return Response.json(item, { status: 201 });
  }

  return new Response('Method not allowed', { status: 405 });
};

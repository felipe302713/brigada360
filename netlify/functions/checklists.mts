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
    if (id) {
      const c = db.checklists.find(c => c.id === id);
      if (!c) return Response.json({ message: 'Não encontrado' }, { status: 404 });
      const categorias = db.checklist_categorias.filter(cat => cat.checklist_id === id).sort((a, b) => a.ordem - b.ordem);
      return Response.json({
        ...c,
        categorias: categorias.map(cat => ({
          ...cat,
          itens: db.checklist_itens.filter(i => i.categoria_id === cat.id && i.ativo).sort((a, b) => a.ordem - b.ordem),
        })),
      });
    }
    return Response.json(db.checklists.map(c => ({
      ...c,
      categorias: db.checklist_categorias.filter(cat => cat.checklist_id === c.id).sort((a, b) => a.ordem - b.ordem).map(cat => ({
        ...cat,
        itens: db.checklist_itens.filter(i => i.categoria_id === cat.id && i.ativo).sort((a, b) => a.ordem - b.ordem),
      })),
    })));
  }

  if (auth.perfil !== 'ADMIN') return Response.json({ message: 'Sem permissão' }, { status: 403 });

  if (req.method === 'POST') {
    const data = await req.json();
    const item = { id: uuid(), nome: data.nome, descricao: data.descricao, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    db.checklists.push(item);
    return Response.json(item, { status: 201 });
  }
  if (req.method === 'PUT' && id) {
    const item = db.checklists.find(c => c.id === id);
    if (!item) return Response.json({ message: 'Não encontrado' }, { status: 404 });
    const data = await req.json();
    Object.assign(item, data, { updated_at: new Date().toISOString() });
    return Response.json(item);
  }
  if (req.method === 'DELETE' && id) {
    const item = db.checklists.find(c => c.id === id);
    if (item) { item.ativo = false; item.updated_at = new Date().toISOString(); }
    return Response.json({ ok: true });
  }
  return new Response('Method not allowed', { status: 405 });
};

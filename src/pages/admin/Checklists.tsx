import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import type { Checklist } from '../../types';
import { Plus, Edit2, Trash2, RotateCcw, Copy, ChevronDown, ChevronRight, X } from 'lucide-react';

export function ChecklistsPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Checklist[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Checklist> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => { api.get<Checklist[]>('/checklists').then(d => { setList(d); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(load, []);

  const handleSave = async () => {
    if (!form) return;
    try {
      if (editing) { await api.put(`/checklists?id=${editing}`, form); toast('Checklist atualizado'); }
      else { await api.post('/checklists', form); toast('Checklist cadastrado'); }
      setForm(null); setEditing(null); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  const toggleAtivo = async (c: Checklist) => {
    try {
      await api.put(`/checklists?id=${c.id}`, { ativo: !c.ativo });
      toast(c.ativo ? 'Checklist inativado' : 'Checklist reativado'); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Checklists</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ nome: '', descricao: '' }); setEditing(null); }}><Plus size={16} /> Novo Checklist</button>
      </div>

      {list.map(c => (
        <div key={c.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
              {expanded === c.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <div>
                <h3>{c.nome}</h3>
                <p style={{ fontSize: '0.8125rem', color: '#757575' }}>{c.descricao || 'Sem descrição'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <span className={`badge ${c.ativo ? 'badge--green' : 'badge--gray'}`}>{c.ativo ? 'Ativo' : 'Inativo'}</span>
              <button className="btn btn-sm btn-secondary" onClick={() => { setForm(c); setEditing(c.id); }}><Edit2 size={14} /></button>
              <button className="btn btn-sm btn-secondary" onClick={() => toggleAtivo(c)}>{c.ativo ? <Trash2 size={14} /> : <RotateCcw size={14} />}</button>
            </div>
          </div>
          {expanded === c.id && c.categorias && (
            <div style={{ marginTop: 16 }}>
              {c.categorias.map(cat => (
                <div key={cat.id} style={{ marginBottom: 12 }}>
                  <h4 style={{ color: '#7B1E3A', marginBottom: 8, fontSize: '0.9375rem' }}>{cat.nome}</h4>
                  <ul style={{ listStyle: 'none', paddingLeft: 16 }}>
                    {cat.itens?.map(item => (
                      <li key={item.id} style={{ padding: '4px 0', fontSize: '0.875rem', borderBottom: '1px solid #F0F0F0' }}>
                        {item.descricao}
                        {item.obrigatorio && <span style={{ color: '#C62828', fontSize: '0.75rem', marginLeft: 8 }}>obrigatório</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {(!c.categorias || c.categorias.length === 0) && <p style={{ color: '#9E9E9E', fontSize: '0.875rem' }}>Nenhuma categoria cadastrada</p>}
            </div>
          )}
        </div>
      ))}

      {list.length === 0 && <div className="empty-state"><p>Nenhum checklist cadastrado</p></div>}

      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-content" style={{ maxWidth: 460, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setForm(null)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>{editing ? 'Editar Checklist' : 'Novo Checklist'}</h2>
            <div className="form-group"><label>Nome *</label><input className="form-control" value={form.nome || ''} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="form-group"><label>Descrição</label><textarea className="form-control" value={form.descricao || ''} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setForm(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

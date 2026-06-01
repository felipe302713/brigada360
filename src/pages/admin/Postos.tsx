import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import type { Posto, Setor } from '../../types';
import { Plus, Search, Edit2, Trash2, RotateCcw, X } from 'lucide-react';

export function PostosPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Posto[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<Posto> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([api.get<Posto[]>('/postos'), api.get<Setor[]>('/setores')])
      .then(([p, s]) => { setList(p); setSetores(s); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = list.filter(p => !search || p.nome.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!form) return;
    try {
      if (editing) { await api.put(`/postos?id=${editing}`, form); toast('Posto atualizado'); }
      else { await api.post('/postos', form); toast('Posto cadastrado'); }
      setForm(null); setEditing(null); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  const toggleAtivo = async (p: Posto) => {
    try {
      await api.put(`/postos?id=${p.id}`, { ativo: !p.ativo });
      toast(p.ativo ? 'Posto inativado' : 'Posto reativado'); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Postos</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ nome: '', setor_id: '', quantidade_minima_profissionais: 1 }); setEditing(null); }}><Plus size={16} /> Novo Posto</button>
      </div>
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9E9E9E' }} />
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Buscar postos..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="card">
        <div className="table-container">
          <table>
            <thead><tr><th>Nome</th><th>Setor</th><th>Mín. Prof.</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{setores.find(s => s.id === p.setor_id)?.nome || '-'}</td>
                  <td>{p.quantidade_minima_profissionais}</td>
                  <td><span className={`badge ${p.ativo ? 'badge--green' : 'badge--gray'}`}>{p.ativo ? 'Ativo' : 'Inativo'}</span></td>
                  <td style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => { setForm(p); setEditing(p.id); }}><Edit2 size={14} /></button>
                    <button className="btn btn-sm btn-secondary" onClick={() => toggleAtivo(p)}>{p.ativo ? <Trash2 size={14} /> : <RotateCcw size={14} />}</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9E9E9E' }}>Nenhum posto encontrado</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-content" style={{ maxWidth: 480, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setForm(null)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>{editing ? 'Editar Posto' : 'Novo Posto'}</h2>
            <div className="form-group"><label>Nome *</label><input className="form-control" value={form.nome || ''} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="form-group"><label>Setor *</label>
              <select className="form-control" value={form.setor_id || ''} onChange={e => setForm({ ...form, setor_id: e.target.value })}>
                <option value="">Selecione...</option>
                {setores.filter(s => s.ativo).map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Localização</label><input className="form-control" value={form.localizacao || ''} onChange={e => setForm({ ...form, localizacao: e.target.value })} /></div>
            <div className="form-group"><label>Quantidade mínima de profissionais</label><input type="number" className="form-control" value={form.quantidade_minima_profissionais || 1} onChange={e => setForm({ ...form, quantidade_minima_profissionais: parseInt(e.target.value) || 1 })} /></div>
            <div className="form-group"><label>Observações</label><textarea className="form-control" value={form.observacoes || ''} onChange={e => setForm({ ...form, observacoes: e.target.value })} /></div>
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

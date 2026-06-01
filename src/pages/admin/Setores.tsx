import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import type { Setor } from '../../types';
import { Plus, Search, Edit2, Trash2, RotateCcw, X } from 'lucide-react';

const EMPTY: Partial<Setor> = { nome: '', descricao: '', localizacao: '', telefone: '', ramal: '', observacoes: '' };

export function SetoresPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Setor[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<Setor> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => { api.get<Setor[]>('/setores').then(d => { setList(d); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(load, []);

  const filtered = list.filter(s => !search || s.nome.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!form) return;
    try {
      if (editing) { await api.put(`/setores?id=${editing}`, form); toast('Setor atualizado'); }
      else { await api.post('/setores', form); toast('Setor cadastrado'); }
      setForm(null); setEditing(null); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  const toggleAtivo = async (s: Setor) => {
    try {
      await api.put(`/setores?id=${s.id}`, { ativo: !s.ativo });
      toast(s.ativo ? 'Setor inativado' : 'Setor reativado'); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Setores</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ ...EMPTY }); setEditing(null); }}><Plus size={16} /> Novo Setor</button>
      </div>
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9E9E9E' }} />
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Buscar setores..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="card">
        <div className="table-container">
          <table>
            <thead><tr><th>Nome</th><th>Localização</th><th>Telefone</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.nome}</td><td>{s.localizacao || '-'}</td><td>{s.telefone || '-'}</td>
                  <td><span className={`badge ${s.ativo ? 'badge--green' : 'badge--gray'}`}>{s.ativo ? 'Ativo' : 'Inativo'}</span></td>
                  <td style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => { setForm(s); setEditing(s.id); }}><Edit2 size={14} /></button>
                    <button className="btn btn-sm btn-secondary" onClick={() => toggleAtivo(s)}>{s.ativo ? <Trash2 size={14} /> : <RotateCcw size={14} />}</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9E9E9E' }}>Nenhum setor encontrado</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-content" style={{ maxWidth: 480, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setForm(null)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>{editing ? 'Editar Setor' : 'Novo Setor'}</h2>
            <div className="form-group"><label>Nome *</label><input className="form-control" value={form.nome || ''} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="form-group"><label>Localização</label><input className="form-control" value={form.localizacao || ''} onChange={e => setForm({ ...form, localizacao: e.target.value })} /></div>
            <div className="form-group"><label>Descrição</label><textarea className="form-control" value={form.descricao || ''} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Telefone</label><input className="form-control" value={form.telefone || ''} onChange={e => setForm({ ...form, telefone: e.target.value })} /></div>
              <div className="form-group"><label>Ramal</label><input className="form-control" value={form.ramal || ''} onChange={e => setForm({ ...form, ramal: e.target.value })} /></div>
            </div>
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

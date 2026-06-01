import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import type { Ronda, Checklist, Usuario } from '../../types';
import { Plus, Search, Edit2, Copy, X } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = { pendente: 'Pendente', em_andamento: 'Em andamento', concluida: 'Concluída', concluida_com_pendencia: 'Com pendência', atrasada: 'Atrasada' };
const STATUS_BADGE: Record<string, string> = { pendente: 'badge--yellow', em_andamento: 'badge--blue', concluida: 'badge--green', concluida_com_pendencia: 'badge--orange', atrasada: 'badge--red' };

export function RondasPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Ronda[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState<Partial<Ronda> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([api.get<Ronda[]>('/rondas'), api.get<Checklist[]>('/checklists'), api.get<Usuario[]>('/usuarios')])
      .then(([r, c, u]) => { setList(r); setChecklists(c); setUsuarios(u); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  let filtered = list;
  if (search) filtered = filtered.filter(r => r.nome.toLowerCase().includes(search.toLowerCase()));
  if (filterStatus) filtered = filtered.filter(r => r.status === filterStatus);

  const handleSave = async () => {
    if (!form) return;
    try {
      if (editing) { await api.put(`/rondas?id=${editing}`, form); toast('Ronda atualizada'); }
      else { await api.post('/rondas', form); toast('Ronda cadastrada'); }
      setForm(null); setEditing(null); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Rondas</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ nome: '', checklist_id: '', data_programada: new Date().toISOString().split('T')[0], horario_programado: '09:30' }); setEditing(null); }}><Plus size={16} /> Nova Ronda</button>
      </div>
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9E9E9E' }} />
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Buscar rondas..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="card">
        <div className="table-container">
          <table>
            <thead><tr><th>Nome</th><th>Data</th><th>Horário</th><th>Checklist</th><th>Responsável</th><th>Status</th><th>%</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>{r.nome}</td>
                  <td>{r.data_programada ? new Date(r.data_programada + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                  <td>{r.horario_programado || '-'}</td>
                  <td>{checklists.find(c => c.id === r.checklist_id)?.nome || '-'}</td>
                  <td>{usuarios.find(u => u.id === r.responsavel_id)?.nome_completo || '-'}</td>
                  <td><span className={`badge ${STATUS_BADGE[r.status] || 'badge--gray'}`}>{STATUS_LABELS[r.status] || r.status}</span></td>
                  <td>{r.percentual_conclusao}%</td>
                  <td style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => { setForm(r); setEditing(r.id); }}><Edit2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9E9E9E' }}>Nenhuma ronda encontrada</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-content" style={{ maxWidth: 500, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setForm(null)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>{editing ? 'Editar Ronda' : 'Nova Ronda'}</h2>
            <div className="form-group"><label>Nome *</label><input className="form-control" value={form.nome || ''} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="form-group"><label>Checklist *</label>
              <select className="form-control" value={form.checklist_id || ''} onChange={e => setForm({ ...form, checklist_id: e.target.value })}>
                <option value="">Selecione...</option>{checklists.filter(c => c.ativo).map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Responsável</label>
              <select className="form-control" value={form.responsavel_id || ''} onChange={e => setForm({ ...form, responsavel_id: e.target.value })}>
                <option value="">Selecione...</option>{usuarios.filter(u => u.ativo).map(u => <option key={u.id} value={u.id}>{u.nome_completo}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Data *</label><input type="date" className="form-control" value={form.data_programada || ''} onChange={e => setForm({ ...form, data_programada: e.target.value })} /></div>
              <div className="form-group"><label>Horário *</label><input type="time" className="form-control" value={form.horario_programado || ''} onChange={e => setForm({ ...form, horario_programado: e.target.value })} /></div>
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

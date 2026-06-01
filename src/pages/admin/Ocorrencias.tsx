import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import { EvolutionCard } from '../../components/EvolutionCard';
import type { Ocorrencia, Setor, Usuario, Equipamento } from '../../types';
import { Plus, Search, Edit2, X, Camera } from 'lucide-react';

const CRITICIDADE_BADGE: Record<string, string> = { baixa: 'badge--blue', media: 'badge--yellow', alta: 'badge--orange', critica: 'badge--red' };
const STATUS_BADGE: Record<string, string> = { aberta: 'badge--red', pendente: 'badge--yellow', em_acompanhamento: 'badge--blue', resolvida: 'badge--green', cancelada: 'badge--gray' };
const CRITICIDADES = ['baixa', 'media', 'alta', 'critica'];
const STATUSES = ['aberta', 'pendente', 'em_acompanhamento', 'resolvida', 'cancelada'];

export function OcorrenciasPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Ocorrencia[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState('');
  const [filterCrit, setFilterCrit] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState<Partial<Ocorrencia> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([api.get<Ocorrencia[]>('/ocorrencias'), api.get<Setor[]>('/setores'), api.get<Usuario[]>('/usuarios')])
      .then(([o, s, u]) => { setList(o); setSetores(s); setUsuarios(u); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  let filtered = list;
  if (search) filtered = filtered.filter(o => o.numero.toLowerCase().includes(search.toLowerCase()) || (o.tipo || '').toLowerCase().includes(search.toLowerCase()));
  if (filterCrit) filtered = filtered.filter(o => o.criticidade === filterCrit);
  if (filterStatus) filtered = filtered.filter(o => o.status === filterStatus);

  const handleSave = async () => {
    if (!form) return;
    try {
      if (editing) { await api.put(`/ocorrencias?id=${editing}`, form); toast('Ocorrência atualizada'); }
      else { await api.post('/ocorrencias', form); toast('Ocorrência registrada'); }
      setForm(null); setEditing(null); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Ocorrências</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ tipo: '', criticidade: 'media', status: 'aberta', descricao: '' }); setEditing(null); }}><Plus size={16} /> Nova Ocorrência</button>
      </div>
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9E9E9E' }} />
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Buscar por número ou tipo..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={filterCrit} onChange={e => setFilterCrit(e.target.value)}>
          <option value="">Criticidade</option>{CRITICIDADES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-control" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Status</option>{STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>
      <div className="card">
        <div className="table-container">
          <table>
            <thead><tr><th>Número</th><th>Tipo</th><th>Setor</th><th>Criticidade</th><th>Status</th><th>Data</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.numero}</strong></td><td>{o.tipo || '-'}</td>
                  <td>{setores.find(s => s.id === o.setor_id)?.nome || '-'}</td>
                  <td><span className={`badge ${CRITICIDADE_BADGE[o.criticidade]}`}>{o.criticidade}</span></td>
                  <td><span className={`badge ${STATUS_BADGE[o.status]}`}>{o.status.replace('_', ' ')}</span></td>
                  <td>{new Date(o.data_hora_abertura).toLocaleDateString('pt-BR')}</td>
                  <td><button className="btn btn-sm btn-secondary" onClick={() => { setForm(o); setEditing(o.id); }}><Edit2 size={14} /></button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9E9E9E' }}>Nenhuma ocorrência encontrada</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <EvolutionCard icon={<Camera size={22} />} nome="Adicionar fotos da ocorrência" descricao="Anexe fotos ao registro de ocorrência" />
      </div>
      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-content" style={{ maxWidth: 520, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setForm(null)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>{editing ? 'Editar Ocorrência' : 'Nova Ocorrência'}</h2>
            <div className="form-group"><label>Tipo</label><input className="form-control" value={form.tipo || ''} onChange={e => setForm({ ...form, tipo: e.target.value })} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Setor</label>
                <select className="form-control" value={form.setor_id || ''} onChange={e => setForm({ ...form, setor_id: e.target.value })}>
                  <option value="">Selecione...</option>{setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Criticidade *</label>
                <select className="form-control" value={form.criticidade || 'media'} onChange={e => setForm({ ...form, criticidade: e.target.value as Ocorrencia['criticidade'] })}>
                  {CRITICIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {editing && (
              <div className="form-group"><label>Status</label>
                <select className="form-control" value={form.status || 'aberta'} onChange={e => setForm({ ...form, status: e.target.value as Ocorrencia['status'] })}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            )}
            <div className="form-group"><label>Responsável atendimento</label>
              <select className="form-control" value={form.responsavel_atendimento_id || ''} onChange={e => setForm({ ...form, responsavel_atendimento_id: e.target.value })}>
                <option value="">Selecione...</option>{usuarios.filter(u => u.ativo).map(u => <option key={u.id} value={u.id}>{u.nome_completo}</option>)}
              </select>
            </div>
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

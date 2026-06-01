import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import type { Equipamento, Setor, InspecaoEquipamento } from '../../types';
import { EvolutionCard } from '../../components/EvolutionCard';
import { Plus, Search, Edit2, Trash2, RotateCcw, ClipboardCheck, X, QrCode } from 'lucide-react';

const TIPOS = ['extintor', 'hidrante', 'mangueira', 'porta corta-fogo', 'detector de fumaça', 'alarme', 'iluminação de emergência', 'gerador', 'outro'];
const STATUS_LABELS: Record<string, string> = { regular: 'Regular', proximo_vencimento: 'Próx. vencimento', vencido: 'Vencido', em_manutencao: 'Em manutenção', inativo: 'Inativo' };
const STATUS_BADGE: Record<string, string> = { regular: 'badge--green', proximo_vencimento: 'badge--orange', vencido: 'badge--red', em_manutencao: 'badge--yellow', inativo: 'badge--gray' };

export function EquipamentosPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Equipamento[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState<Partial<Equipamento> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [inspecaoForm, setInspecaoForm] = useState<{ equipamento_id: string; resultado: string; observacao: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([api.get<Equipamento[]>('/equipamentos'), api.get<Setor[]>('/setores')])
      .then(([e, s]) => { setList(e); setSetores(s); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  let filtered = list;
  if (search) filtered = filtered.filter(e => e.codigo.toLowerCase().includes(search.toLowerCase()) || e.tipo.toLowerCase().includes(search.toLowerCase()));
  if (filterTipo) filtered = filtered.filter(e => e.tipo.toLowerCase().includes(filterTipo.toLowerCase()));
  if (filterStatus) filtered = filtered.filter(e => e.status === filterStatus);

  const handleSave = async () => {
    if (!form) return;
    try {
      if (editing) { await api.put(`/equipamentos?id=${editing}`, form); toast('Equipamento atualizado'); }
      else { await api.post('/equipamentos', form); toast('Equipamento cadastrado'); }
      setForm(null); setEditing(null); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  const handleInspecao = async () => {
    if (!inspecaoForm) return;
    try {
      await api.post('/inspecoes', inspecaoForm);
      toast('Inspeção registrada'); setInspecaoForm(null); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  const toggleAtivo = async (eq: Equipamento) => {
    try {
      await api.put(`/equipamentos?id=${eq.id}`, { ativo: !eq.ativo });
      toast(eq.ativo ? 'Equipamento inativado' : 'Equipamento reativado'); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Equipamentos</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ codigo: '', tipo: '', classe: '', localizacao: '' }); setEditing(null); }}><Plus size={16} /> Novo Equipamento</button>
      </div>

      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9E9E9E' }} />
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Buscar por código ou tipo..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="form-control" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead><tr><th>Código</th><th>Tipo</th><th>Localização</th><th>Vencimento</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.codigo}</strong></td>
                  <td>{e.tipo}</td>
                  <td>{e.localizacao || '-'}</td>
                  <td>{e.data_vencimento ? new Date(e.data_vencimento).toLocaleDateString('pt-BR') : '-'}</td>
                  <td><span className={`badge ${STATUS_BADGE[e.status]}`}>{STATUS_LABELS[e.status]}</span></td>
                  <td style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => { setForm(e); setEditing(e.id); }}><Edit2 size={14} /></button>
                    <button className="btn btn-sm btn-success" onClick={() => setInspecaoForm({ equipamento_id: e.id, resultado: 'regular', observacao: '' })} title="Registrar inspeção"><ClipboardCheck size={14} /></button>
                    <button className="btn btn-sm btn-secondary" onClick={() => toggleAtivo(e)}>{e.ativo ? <Trash2 size={14} /> : <RotateCcw size={14} />}</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9E9E9E' }}>Nenhum equipamento encontrado</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <EvolutionCard icon={<QrCode size={22} />} nome="Leitura automática por QR Code" descricao="Consulte equipamentos pela câmera do celular" />
      </div>

      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-content" style={{ maxWidth: 520, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setForm(null)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>{editing ? 'Editar Equipamento' : 'Novo Equipamento'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Código *</label><input className="form-control" value={form.codigo || ''} onChange={e => setForm({ ...form, codigo: e.target.value })} /></div>
              <div className="form-group"><label>Tipo *</label>
                <select className="form-control" value={form.tipo || ''} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  <option value="">Selecione...</option>{TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Classe</label><input className="form-control" value={form.classe || ''} onChange={e => setForm({ ...form, classe: e.target.value })} /></div>
              <div className="form-group"><label>Setor</label>
                <select className="form-control" value={form.setor_id || ''} onChange={e => setForm({ ...form, setor_id: e.target.value })}>
                  <option value="">Selecione...</option>{setores.filter(s => s.ativo).map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Localização</label><input className="form-control" value={form.localizacao || ''} onChange={e => setForm({ ...form, localizacao: e.target.value })} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Data instalação</label><input type="date" className="form-control" value={form.data_instalacao || ''} onChange={e => setForm({ ...form, data_instalacao: e.target.value })} /></div>
              <div className="form-group"><label>Data vencimento</label><input type="date" className="form-control" value={form.data_vencimento || ''} onChange={e => setForm({ ...form, data_vencimento: e.target.value })} /></div>
            </div>
            <div className="form-group"><label>Observações</label><textarea className="form-control" value={form.observacoes || ''} onChange={e => setForm({ ...form, observacoes: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setForm(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {inspecaoForm && (
        <div className="modal-overlay" onClick={() => setInspecaoForm(null)}>
          <div className="modal-content" style={{ maxWidth: 420, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setInspecaoForm(null)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>Registrar Inspeção</h2>
            <div className="form-group"><label>Resultado *</label>
              <select className="form-control" value={inspecaoForm.resultado} onChange={e => setInspecaoForm({ ...inspecaoForm, resultado: e.target.value })}>
                <option value="regular">Regular</option><option value="atencao">Atenção</option>
                <option value="critico">Crítico</option><option value="em_manutencao">Em manutenção</option>
              </select>
            </div>
            <div className="form-group"><label>Observação</label><textarea className="form-control" value={inspecaoForm.observacao} onChange={e => setInspecaoForm({ ...inspecaoForm, observacao: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setInspecaoForm(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleInspecao}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

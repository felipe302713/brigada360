import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/Toast';
import { EvolutionCard } from '../../components/EvolutionCard';
import type { Ocorrencia, Setor } from '../../types';
import { Plus, Camera, X } from 'lucide-react';

const CRIT_BADGE: Record<string, string> = { baixa: 'badge--blue', media: 'badge--yellow', alta: 'badge--orange', critica: 'badge--red' };
const STATUS_BADGE: Record<string, string> = { aberta: 'badge--red', pendente: 'badge--yellow', em_acompanhamento: 'badge--blue', resolvida: 'badge--green', cancelada: 'badge--gray' };

export function AppOcorrencias() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [list, setList] = useState<Ocorrencia[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tipo: '', setor_id: '', criticidade: 'media', descricao: '' });
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([api.get<Ocorrencia[]>('/ocorrencias'), api.get<Setor[]>('/setores')])
      .then(([o, s]) => { setList(o); setSetores(s); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async () => {
    try {
      await api.post('/ocorrencias', form);
      toast('Ocorrência registrada');
      setShowForm(false);
      setForm({ tipo: '', setor_id: '', criticidade: 'media', descricao: '' });
      load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.25rem' }}>Ocorrências</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}><Plus size={14} /> Nova</button>
      </div>

      {list.map(o => (
        <div key={o.id} className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <strong>{o.numero}</strong>
              <p style={{ fontSize: '0.8125rem', color: '#757575', marginTop: 2 }}>{o.tipo}</p>
              <p style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>{setores.find(s => s.id === o.setor_id)?.nome}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${CRIT_BADGE[o.criticidade]}`}>{o.criticidade}</span>
              <br />
              <span className={`badge ${STATUS_BADGE[o.status]}`} style={{ marginTop: 4 }}>{o.status.replace(/_/g, ' ')}</span>
            </div>
          </div>
          {o.descricao && <p style={{ fontSize: '0.8125rem', color: '#616161', marginTop: 8 }}>{o.descricao}</p>}
        </div>
      ))}

      {list.length === 0 && <div className="empty-state"><p>Nenhuma ocorrência registrada</p></div>}

      <div style={{ marginTop: 24 }}>
        <EvolutionCard icon={<Camera size={20} />} nome="Fotos na ocorrência" descricao="Anexe fotos como evidência" />
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" style={{ maxWidth: 440, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>Nova Ocorrência</h2>
            <div className="form-group"><label>Tipo</label><input className="form-control" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} placeholder="Ex: Equipamento danificado" /></div>
            <div className="form-group"><label>Setor</label>
              <select className="form-control" value={form.setor_id} onChange={e => setForm({ ...form, setor_id: e.target.value })}>
                <option value="">Selecione...</option>{setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Criticidade</label>
              <select className="form-control" value={form.criticidade} onChange={e => setForm({ ...form, criticidade: e.target.value })}>
                <option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option><option value="critica">Crítica</option>
              </select>
            </div>
            <div className="form-group"><label>Descrição</label><textarea className="form-control" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

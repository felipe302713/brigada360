import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/Toast';
import { EvolutionCard } from '../../components/EvolutionCard';
import type { Equipamento } from '../../types';
import { Search, ClipboardCheck, QrCode, X } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = { regular: 'Regular', proximo_vencimento: 'Próx. vencimento', vencido: 'Vencido', em_manutencao: 'Em manutenção', inativo: 'Inativo' };
const STATUS_BADGE: Record<string, string> = { regular: 'badge--green', proximo_vencimento: 'badge--orange', vencido: 'badge--red', em_manutencao: 'badge--yellow', inativo: 'badge--gray' };

export function AppEquipamentos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [list, setList] = useState<Equipamento[]>([]);
  const [search, setSearch] = useState('');
  const [inspecaoForm, setInspecaoForm] = useState<{ equipamento_id: string; resultado: string; observacao: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Equipamento[]>('/equipamentos').then(d => { setList(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = search ? list.filter(e => e.codigo.toLowerCase().includes(search.toLowerCase())) : list;

  const handleInspecao = async () => {
    if (!inspecaoForm) return;
    try {
      await api.post('/inspecoes', inspecaoForm);
      toast('Inspeção registrada'); setInspecaoForm(null);
      api.get<Equipamento[]>('/equipamentos').then(setList);
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <h1 style={{ marginBottom: 16, fontSize: '1.25rem' }}>Equipamentos</h1>
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9E9E9E' }} />
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Buscar por código..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.map(e => (
        <div key={e.id} className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <strong>{e.codigo}</strong> <span className={`badge ${STATUS_BADGE[e.status]}`}>{STATUS_LABELS[e.status]}</span>
              <p style={{ fontSize: '0.8125rem', color: '#757575', marginTop: 4 }}>{e.tipo}{e.classe ? ` — Classe ${e.classe}` : ''}</p>
              <p style={{ fontSize: '0.8125rem', color: '#9E9E9E' }}>{e.localizacao}</p>
              {e.data_vencimento && <p style={{ fontSize: '0.75rem', color: e.status === 'vencido' ? '#C62828' : '#757575' }}>Venc: {new Date(e.data_vencimento).toLocaleDateString('pt-BR')}</p>}
            </div>
            <button className="btn btn-sm btn-success" onClick={() => setInspecaoForm({ equipamento_id: e.id, resultado: 'regular', observacao: '' })}>
              <ClipboardCheck size={14} /> Inspeção
            </button>
          </div>
        </div>
      ))}

      {filtered.length === 0 && <div className="empty-state"><p>{search ? 'Nenhum equipamento encontrado' : 'Nenhum equipamento cadastrado'}</p></div>}

      <div style={{ marginTop: 24 }}>
        <EvolutionCard icon={<QrCode size={20} />} nome="QR Code pela câmera" descricao="Escaneie para consultar equipamento" />
      </div>

      {inspecaoForm && (
        <div className="modal-overlay" onClick={() => setInspecaoForm(null)}>
          <div className="modal-content" style={{ maxWidth: 400, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setInspecaoForm(null)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>Registrar Inspeção</h2>
            <div className="form-group"><label>Resultado</label>
              <select className="form-control" value={inspecaoForm.resultado} onChange={e => setInspecaoForm({ ...inspecaoForm, resultado: e.target.value })}>
                <option value="regular">Regular</option><option value="atencao">Atenção</option>
                <option value="critico">Crítico</option><option value="em_manutencao">Em manutenção</option>
              </select>
            </div>
            <div className="form-group"><label>Observação</label><textarea className="form-control" value={inspecaoForm.observacao} onChange={e => setInspecaoForm({ ...inspecaoForm, observacao: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setInspecaoForm(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleInspecao}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

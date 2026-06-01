import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/Toast';
import type { Ronda, Checklist, ChecklistCategoria, ChecklistItem, RondaResposta } from '../../types';
import { CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

type Resultado = 'regular' | 'atencao' | 'critico' | 'nao_se_aplica';

interface RespostaLocal {
  checklist_item_id: string;
  resultado: Resultado | null;
  observacao: string;
}

export function ExecutarRonda() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [ronda, setRonda] = useState<Ronda | null>(null);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [respostas, setRespostas] = useState<RespostaLocal[]>([]);
  const [existingRespostas, setExistingRespostas] = useState<RondaResposta[]>([]);
  const [saving, setSaving] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<Ronda>(`/rondas?id=${id}`),
      api.get<RondaResposta[]>(`/ronda-respostas?rondaId=${id}`)
    ]).then(([r, existResp]) => {
      setRonda(r);
      setExistingRespostas(existResp);
      if (r.checklist_id) {
        api.get<Checklist>(`/checklists?id=${r.checklist_id}`).then(c => {
          setChecklist(c);
          const allItems = c.categorias?.flatMap(cat => cat.itens || []) || [];
          setRespostas(allItems.map(item => {
            const existing = existResp.find(er => er.checklist_item_id === item.id);
            return {
              checklist_item_id: item.id,
              resultado: (existing?.resultado as Resultado) || null,
              observacao: existing?.observacao || '',
            };
          }));
          setLoading(false);
        });
      }
    }).catch(() => setLoading(false));
  }, [id]);

  const updateResposta = (itemId: string, field: 'resultado' | 'observacao', value: string) => {
    setRespostas(prev => prev.map(r => r.checklist_item_id === itemId ? { ...r, [field]: value } : r));
  };

  const totalItems = respostas.length;
  const answeredItems = respostas.filter(r => r.resultado !== null).length;
  const progress = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;

  const canFinalize = () => {
    for (const r of respostas) {
      if (r.resultado === null) return false;
      if ((r.resultado === 'atencao' || r.resultado === 'critico') && !r.observacao.trim()) return false;
    }
    return true;
  };

  const getValidationErrors = (): string[] => {
    const errors: string[] = [];
    const allItems = checklist?.categorias?.flatMap(cat => cat.itens || []) || [];
    for (const r of respostas) {
      if (r.resultado === null) {
        const item = allItems.find(i => i.id === r.checklist_item_id);
        errors.push(`"${item?.descricao}" não foi respondido`);
      }
      if ((r.resultado === 'atencao' || r.resultado === 'critico') && !r.observacao.trim()) {
        const item = allItems.find(i => i.id === r.checklist_item_id);
        errors.push(`"${item?.descricao}" exige observação`);
      }
    }
    return errors;
  };

  const saveRespostas = async () => {
    if (!id || !user) return;
    setSaving(true);
    try {
      for (const r of respostas.filter(r => r.resultado !== null)) {
        await api.post('/ronda-respostas', { ronda_id: id, ...r, responsavel_id: user.id });
      }
      toast('Respostas salvas');
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro ao salvar', 'error'); }
    setSaving(false);
  };

  const finalizar = async () => {
    if (!canFinalize()) {
      const errors = getValidationErrors();
      toast(errors[0], 'error');
      return;
    }
    setSaving(true);
    try {
      await saveRespostas();
      await api.post(`/rondas?id=${id}&action=finalizar`);
      setShowSummary(true);
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
    setSaving(false);
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!ronda || !checklist) return <div className="empty-state"><p>Ronda não encontrada</p></div>;

  const regulares = respostas.filter(r => r.resultado === 'regular').length;
  const atencao = respostas.filter(r => r.resultado === 'atencao').length;
  const criticos = respostas.filter(r => r.resultado === 'critico').length;
  const na = respostas.filter(r => r.resultado === 'nao_se_aplica').length;
  const hasPendencia = atencao > 0 || criticos > 0;

  if (showSummary) {
    return (
      <div className="checklist-exec">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <CheckCircle size={64} color={hasPendencia ? '#F57F17' : '#2E7D32'} />
          <h2 style={{ marginTop: 12 }}>Ronda {hasPendencia ? 'Concluída com Pendência' : 'Concluída'}</h2>
        </div>
        <div className="card ronda-summary">
          <div className="stat-row"><span>Itens regulares</span><span style={{ color: '#2E7D32' }}>{regulares}</span></div>
          <div className="stat-row"><span>Itens de atenção</span><span style={{ color: '#F57F17' }}>{atencao}</span></div>
          <div className="stat-row"><span>Itens críticos</span><span style={{ color: '#C62828' }}>{criticos}</span></div>
          <div className="stat-row"><span>Não se aplica</span><span>{na}</span></div>
          <div className="stat-row"><span>Percentual concluído</span><span>{progress}%</span></div>
          <div className="stat-row"><span>Responsável</span><span>{user?.nome_completo}</span></div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
          {hasPendencia && (
            <button className="btn btn-danger" onClick={() => navigate('/app/ocorrencias/nova')}>
              <AlertTriangle size={16} /> Criar ocorrência
            </button>
          )}
          <button className="btn btn-primary" onClick={() => navigate('/app/rondas')}>Voltar às rondas</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checklist-exec">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button className="btn btn-sm btn-secondary" onClick={() => navigate('/app/rondas')}><ArrowLeft size={16} /></button>
        <div><h2 style={{ fontSize: '1.125rem' }}>{ronda.nome}</h2><p style={{ fontSize: '0.8125rem', color: '#757575' }}>{checklist.nome}</p></div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 6 }}>
          <span>{answeredItems}/{totalItems} itens</span><span>{progress}%</span>
        </div>
        <div className="progress-bar"><div className="progress-bar__fill progress-bar__fill--primary" style={{ width: `${progress}%` }} /></div>
      </div>

      {checklist.categorias?.map(cat => (
        <div key={cat.id} className="checklist-category">
          <h3>{cat.nome}</h3>
          {cat.itens?.map(item => {
            const resp = respostas.find(r => r.checklist_item_id === item.id);
            const needsObs = resp && (resp.resultado === 'atencao' || resp.resultado === 'critico') && !resp.observacao.trim();
            return (
              <div key={item.id} className="checklist-item">
                <div className="checklist-item__desc">{item.descricao}</div>
                <div className="checklist-item__options">
                  {(['regular', 'atencao', 'critico', 'nao_se_aplica'] as Resultado[]).map(opt => (
                    <button key={opt} className={`checklist-option checklist-option--${opt === 'nao_se_aplica' ? 'na' : opt} ${resp?.resultado === opt ? 'selected' : ''}`}
                      onClick={() => updateResposta(item.id, 'resultado', opt)}>
                      {opt === 'regular' ? 'Regular' : opt === 'atencao' ? 'Atenção' : opt === 'critico' ? 'Crítico' : 'N/A'}
                    </button>
                  ))}
                </div>
                {(resp?.resultado === 'atencao' || resp?.resultado === 'critico') && (
                  <div className="checklist-item__obs">
                    <textarea className="form-control" placeholder="Observação obrigatória..." value={resp?.observacao || ''} onChange={e => updateResposta(item.id, 'observacao', e.target.value)} />
                    {needsObs && <p className="obs-required">Observação obrigatória para itens de atenção ou críticos</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', paddingBottom: 32 }}>
        <button className="btn btn-secondary" onClick={saveRespostas} disabled={saving}>Salvar progresso</button>
        <button className="btn btn-primary" onClick={finalizar} disabled={saving || !canFinalize()}>Finalizar ronda</button>
      </div>
    </div>
  );
}

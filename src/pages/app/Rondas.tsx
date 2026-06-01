import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import type { Ronda } from '../../types';
import { Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = { pendente: 'badge--yellow', em_andamento: 'badge--blue', concluida: 'badge--green', concluida_com_pendencia: 'badge--orange', atrasada: 'badge--red' };
const STATUS_LABELS: Record<string, string> = { pendente: 'Pendente', em_andamento: 'Em andamento', concluida: 'Concluída', concluida_com_pendencia: 'Com pendência', atrasada: 'Atrasada' };

export function AppRondas() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rondas, setRondas] = useState<Ronda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Ronda[]>('/rondas').then(d => { setRondas(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const iniciarRonda = async (id: string) => {
    try {
      await api.post(`/rondas?id=${id}&action=iniciar`);
      toast('Ronda iniciada');
      navigate(`/app/rondas/${id}/executar`);
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const pendentes = rondas.filter(r => r.status === 'pendente' || r.status === 'atrasada');
  const emAndamento = rondas.filter(r => r.status === 'em_andamento');
  const concluidas = rondas.filter(r => r.status === 'concluida' || r.status === 'concluida_com_pendencia');

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: '1.25rem' }}>Rondas</h1>

      {emAndamento.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12, color: '#1565C0' }}>Em andamento</h3>
          {emAndamento.map(r => (
            <div key={r.id} className="card" style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => navigate(`/app/rondas/${r.id}/executar`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{r.nome}</strong><p style={{ fontSize: '0.8125rem', color: '#757575' }}>{r.horario_programado}</p></div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${STATUS_BADGE[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                  <p style={{ fontSize: '0.75rem', color: '#757575', marginTop: 4 }}>{r.percentual_conclusao}%</p>
                </div>
              </div>
              <div className="progress-bar" style={{ marginTop: 8 }}><div className="progress-bar__fill progress-bar__fill--primary" style={{ width: `${r.percentual_conclusao}%` }} /></div>
            </div>
          ))}
        </div>
      )}

      {pendentes.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Pendentes</h3>
          {pendentes.map(r => (
            <div key={r.id} className="card" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{r.nome}</strong><p style={{ fontSize: '0.8125rem', color: '#757575' }}>{r.horario_programado}</p></div>
                <button className="btn btn-primary btn-sm" onClick={() => iniciarRonda(r.id)}><Play size={14} /> Iniciar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {concluidas.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 12, color: '#2E7D32' }}>Concluídas</h3>
          {concluidas.map(r => (
            <div key={r.id} className="card" style={{ marginBottom: 8, opacity: 0.8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{r.nome}</strong><p style={{ fontSize: '0.8125rem', color: '#757575' }}>{r.horario_programado}</p></div>
                <span className={`badge ${STATUS_BADGE[r.status]}`}>{STATUS_LABELS[r.status]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {rondas.length === 0 && <div className="empty-state"><Clock size={48} /><p>Nenhuma ronda agendada</p></div>}
    </div>
  );
}

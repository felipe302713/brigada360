import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Ronda, InspecaoEquipamento } from '../../types';

const STATUS_BADGE: Record<string, string> = { pendente: 'badge--yellow', em_andamento: 'badge--blue', concluida: 'badge--green', concluida_com_pendencia: 'badge--orange', atrasada: 'badge--red' };
const RESULTADO_BADGE: Record<string, string> = { regular: 'badge--green', atencao: 'badge--yellow', critico: 'badge--red', em_manutencao: 'badge--orange' };

export function HistoricoPage() {
  const [tab, setTab] = useState<'rondas' | 'inspecoes'>('rondas');
  const [rondas, setRondas] = useState<Ronda[]>([]);
  const [inspecoes, setInspecoes] = useState<InspecaoEquipamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get<Ronda[]>('/rondas'), api.get<InspecaoEquipamento[]>('/inspecoes')])
      .then(([r, i]) => { setRondas(r); setInspecoes(i); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header"><h1>Histórico</h1></div>
      <div className="tabs">
        <button className={`tab ${tab === 'rondas' ? 'tab--active' : ''}`} onClick={() => setTab('rondas')}>Rondas</button>
        <button className={`tab ${tab === 'inspecoes' ? 'tab--active' : ''}`} onClick={() => setTab('inspecoes')}>Inspeções</button>
      </div>

      {tab === 'rondas' && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead><tr><th>Data</th><th>Horário</th><th>Nome</th><th>Responsável</th><th>%</th><th>Status</th></tr></thead>
              <tbody>
                {rondas.map(r => (
                  <tr key={r.id}>
                    <td>{r.data_programada ? new Date(r.data_programada + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                    <td>{r.horario_programado || '-'}</td>
                    <td>{r.nome}</td>
                    <td>{r.responsavel?.nome_completo || '-'}</td>
                    <td>{r.percentual_conclusao}%</td>
                    <td><span className={`badge ${STATUS_BADGE[r.status] || 'badge--gray'}`}>{r.status.replace(/_/g, ' ')}</span></td>
                  </tr>
                ))}
                {rondas.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9E9E9E' }}>Nenhuma ronda registrada</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'inspecoes' && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead><tr><th>Data</th><th>Equipamento</th><th>Responsável</th><th>Resultado</th><th>Observação</th></tr></thead>
              <tbody>
                {inspecoes.map(i => (
                  <tr key={i.id}>
                    <td>{new Date(i.data_hora_inspecao).toLocaleDateString('pt-BR')}</td>
                    <td>{i.equipamento?.codigo || '-'}</td>
                    <td>{i.responsavel?.nome_completo || '-'}</td>
                    <td><span className={`badge ${RESULTADO_BADGE[i.resultado]}`}>{i.resultado}</span></td>
                    <td>{i.observacao || '-'}</td>
                  </tr>
                ))}
                {inspecoes.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9E9E9E' }}>Nenhuma inspeção registrada</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

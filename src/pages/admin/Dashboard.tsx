import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { DashboardData } from '../../types';
import {
  Users, Building2, Route, Wrench, AlertTriangle, CheckCircle,
  Clock, AlertCircle, ShieldAlert
} from 'lucide-react';

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardData>('/dashboard').then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><p>Erro ao carregar dashboard</p></div>;

  return (
    <div>
      <div className="page-header"><h1>Dashboard</h1></div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary"><Users size={22} /></div>
          <div><div className="stat-card__value">{data.usuarios_ativos}</div><div className="stat-card__label">Usuários ativos</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue"><Users size={22} /></div>
          <div><div className="stat-card__value">{data.profissionais_disponiveis}</div><div className="stat-card__label">Profissionais disponíveis</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary"><Building2 size={22} /></div>
          <div><div className="stat-card__value">{data.postos_ativos}</div><div className="stat-card__label">Postos ativos</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue"><Route size={22} /></div>
          <div><div className="stat-card__value">{data.rondas_hoje}</div><div className="stat-card__label">Rondas hoje</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green"><CheckCircle size={22} /></div>
          <div><div className="stat-card__value">{data.rondas_concluidas}</div><div className="stat-card__label">Rondas concluídas</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--yellow"><Clock size={22} /></div>
          <div><div className="stat-card__value">{data.rondas_pendentes}</div><div className="stat-card__label">Rondas pendentes</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue"><Wrench size={22} /></div>
          <div><div className="stat-card__value">{data.equipamentos_total}</div><div className="stat-card__label">Equipamentos</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green"><Wrench size={22} /></div>
          <div><div className="stat-card__value">{data.equipamentos_regulares}</div><div className="stat-card__label">Regulares</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--orange"><AlertCircle size={22} /></div>
          <div><div className="stat-card__value">{data.equipamentos_proximo_vencimento}</div><div className="stat-card__label">Próx. vencimento</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--red"><ShieldAlert size={22} /></div>
          <div><div className="stat-card__value">{data.equipamentos_vencidos}</div><div className="stat-card__label">Vencidos</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--yellow"><AlertTriangle size={22} /></div>
          <div><div className="stat-card__value">{data.ocorrencias_abertas}</div><div className="stat-card__label">Ocorrências abertas</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--red"><AlertTriangle size={22} /></div>
          <div><div className="stat-card__value">{data.ocorrencias_criticas}</div><div className="stat-card__label">Ocorrências críticas</div></div>
        </div>
      </div>

      {data.alertas.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ marginBottom: 16 }}>Atenção necessária</h2>
          {data.alertas.map((a, i) => (
            <div key={i} className={`alert-card alert-card--${a.criticidade}`}>
              {a.criticidade === 'critico' ? <AlertTriangle size={18} /> : a.criticidade === 'atencao' ? <AlertCircle size={18} /> : <AlertCircle size={18} />}
              <div>
                <strong>{a.titulo}</strong>
                <p style={{ fontSize: '0.8125rem', marginTop: 2 }}>{a.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

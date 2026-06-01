import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { EvolutionCard } from '../../components/EvolutionCard';
import type { DashboardData } from '../../types';
import { Route, Search, AlertTriangle, Clock, Wrench, MessageCircle, Bell, QrCode } from 'lucide-react';

export function AppHome() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get<DashboardData>('/dashboard').then(setData).catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>Olá, {user?.nome_completo?.split(' ')[0]}</h2>
        <p style={{ color: '#757575', fontSize: '0.875rem' }}>{user?.perfil}</p>
      </div>

      <div className="quick-actions">
        <Link to="/app/rondas" className="quick-action">
          <div className="quick-action__icon"><Route size={28} /></div>
          <div className="quick-action__label">Iniciar próxima ronda</div>
        </Link>
        <Link to="/app/equipamentos" className="quick-action">
          <div className="quick-action__icon"><Search size={28} /></div>
          <div className="quick-action__label">Consultar equipamento</div>
        </Link>
        <Link to="/app/ocorrencias/nova" className="quick-action">
          <div className="quick-action__icon"><AlertTriangle size={28} /></div>
          <div className="quick-action__label">Registrar ocorrência</div>
        </Link>
      </div>

      {data && (
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--yellow"><Clock size={22} /></div>
            <div><div className="stat-card__value">{data.rondas_pendentes}</div><div className="stat-card__label">Rondas pendentes</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--red"><AlertTriangle size={22} /></div>
            <div><div className="stat-card__value">{data.ocorrencias_abertas}</div><div className="stat-card__label">Ocorrências abertas</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--orange"><Wrench size={22} /></div>
            <div><div className="stat-card__value">{data.equipamentos_proximo_vencimento}</div><div className="stat-card__label">Equip. próx. vencimento</div></div>
          </div>
        </div>
      )}

      {data && data.alertas.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Alertas</h3>
          {data.alertas.slice(0, 5).map((a, i) => (
            <div key={i} className={`alert-card alert-card--${a.criticidade}`}>
              <AlertTriangle size={16} />
              <div><strong style={{ fontSize: '0.8125rem' }}>{a.titulo}</strong><p style={{ fontSize: '0.75rem', marginTop: 2 }}>{a.descricao}</p></div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ marginBottom: 12 }}>Em breve</h3>
      <div className="evolution-grid">
        <EvolutionCard icon={<MessageCircle size={20} />} nome="Chat da equipe" descricao="Comunicação em tempo real" />
        <EvolutionCard icon={<Bell size={20} />} nome="Notificações automáticas" descricao="Alertas e lembretes" />
        <EvolutionCard icon={<QrCode size={20} />} nome="QR Code pela câmera" descricao="Escaneie equipamentos" />
      </div>
    </div>
  );
}

import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { EvolutionCard } from '../../components/EvolutionCard';
import { LogOut, User, MessageCircle, Bell, CalendarDays, BookOpen } from 'lucide-react';

export function AppMais() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: '1.25rem' }}>Mais</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#7B1E3A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}>
            {user?.nome_completo?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <strong>{user?.nome_completo}</strong>
            <p style={{ fontSize: '0.8125rem', color: '#757575' }}>{user?.perfil}</p>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: 12 }}>Funcionalidades em evolução</h3>
      <div className="evolution-grid">
        <EvolutionCard icon={<MessageCircle size={20} />} nome="Chat interno" descricao="Comunicação em tempo real" />
        <EvolutionCard icon={<Bell size={20} />} nome="Notificações" descricao="Alertas automáticos" />
        <EvolutionCard icon={<CalendarDays size={20} />} nome="Escala 12x36" descricao="Calendário avançado" />
        <EvolutionCard icon={<BookOpen size={20} />} nome="Cartilha digital" descricao="Material de segurança" />
      </div>

      <button className="btn btn-danger" style={{ width: '100%', marginTop: 24 }} onClick={handleLogout}>
        <LogOut size={16} /> Sair do sistema
      </button>
    </div>
  );
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, Users, MapPin, Building2, Wrench, ClipboardList,
  Route, AlertTriangle, History, Shield, Settings, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/usuarios', icon: Users, label: 'Usuários' },
  { to: '/admin/setores', icon: MapPin, label: 'Setores' },
  { to: '/admin/postos', icon: Building2, label: 'Postos' },
  { to: '/admin/equipamentos', icon: Wrench, label: 'Equipamentos' },
  { to: '/admin/checklists', icon: ClipboardList, label: 'Checklists' },
  { to: '/admin/rondas', icon: Route, label: 'Rondas' },
  { to: '/admin/ocorrencias', icon: AlertTriangle, label: 'Ocorrências' },
  { to: '/admin/historico', icon: History, label: 'Histórico' },
  { to: '/admin/auditoria', icon: Shield, label: 'Auditoria' },
  { to: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.nome_completo?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <div className="layout">
      <div className="mobile-header">
        <button className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1>Brigada360</h1>
        <div style={{ width: 24 }} />
      </div>

      {sidebarOpen && <div className="modal-overlay" style={{ zIndex: 99 }} onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <h2>Brigada360</h2>
          <span>Gestão Inteligente de Segurança Predial</span>
        </div>
        <nav className="sidebar__nav">
          <div className="sidebar__section">
            <div className="sidebar__section-title">Menu Principal</div>
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} /> {item.label}
              </NavLink>
            ))}
          </div>
          <div className="sidebar__section">
            <div className="sidebar__section-title">Próximas Evoluções</div>
            <NavLink to="/admin/evolucoes" className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Route size={18} /> Roadmap
            </NavLink>
          </div>
        </nav>
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">{initials}</div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{user?.nome_completo}</div>
            <div className="sidebar__user-role">{user?.perfil}</div>
          </div>
          <button className="btn-icon" onClick={handleLogout} title="Sair"><LogOut size={18} /></button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

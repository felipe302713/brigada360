import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, Route, Wrench, AlertTriangle, MoreHorizontal, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const BOTTOM_NAV = [
  { to: '/app', icon: Home, label: 'Início', end: true },
  { to: '/app/rondas', icon: Route, label: 'Rondas' },
  { to: '/app/equipamentos', icon: Wrench, label: 'Equip.' },
  { to: '/app/ocorrencias', icon: AlertTriangle, label: 'Ocorrências' },
  { to: '/app/mais', icon: MoreHorizontal, label: 'Mais' },
];

export function OperationalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout" style={{ flexDirection: 'column' }}>
      <div className="mobile-header" style={{ display: 'flex' }}>
        <button className="btn-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1>Brigada360</h1>
        <button className="btn-icon" onClick={handleLogout} title="Sair"><LogOut size={20} /></button>
      </div>

      {menuOpen && (
        <div className="modal-overlay" style={{ zIndex: 99 }} onClick={() => setMenuOpen(false)}>
          <div className="modal-content" style={{ textAlign: 'left', maxWidth: 300 }} onClick={e => e.stopPropagation()}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>{user?.nome_completo}</p>
            <p style={{ fontSize: '0.8125rem', color: '#757575', marginBottom: 16 }}>{user?.perfil}</p>
            <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleLogout}>
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      )}

      <main className="main-content" style={{ marginLeft: 0, paddingTop: 72, paddingBottom: 80 }}>
        <Outlet />
      </main>

      <nav className="mobile-nav" style={{ display: 'block' }}>
        <div className="mobile-nav__items">
          {BOTTOM_NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

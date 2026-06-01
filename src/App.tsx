import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/Toast';
import { LoginPage } from './pages/Login';
import { AdminLayout } from './layouts/AdminLayout';
import { OperationalLayout } from './layouts/OperationalLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { UsuariosPage } from './pages/admin/Usuarios';
import { SetoresPage } from './pages/admin/Setores';
import { PostosPage } from './pages/admin/Postos';
import { EquipamentosPage } from './pages/admin/Equipamentos';
import { ChecklistsPage } from './pages/admin/Checklists';
import { RondasPage } from './pages/admin/Rondas';
import { OcorrenciasPage } from './pages/admin/Ocorrencias';
import { HistoricoPage } from './pages/admin/Historico';
import { AuditoriaPage } from './pages/admin/Auditoria';
import { ConfiguracoesPage } from './pages/admin/Configuracoes';
import { EvolucoesPage } from './pages/admin/Evolucoes';
import { AppHome } from './pages/app/Home';
import { AppRondas } from './pages/app/Rondas';
import { ExecutarRonda } from './pages/app/ExecutarRonda';
import { AppEquipamentos } from './pages/app/Equipamentos';
import { AppOcorrencias } from './pages/app/Ocorrencias';
import { AppMais } from './pages/app/Mais';
import './styles/global.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.perfil !== 'ADMIN') return <Navigate to="/app" replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return user.perfil === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/app" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RootRedirect />} />

            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="setores" element={<SetoresPage />} />
              <Route path="postos" element={<PostosPage />} />
              <Route path="equipamentos" element={<EquipamentosPage />} />
              <Route path="checklists" element={<ChecklistsPage />} />
              <Route path="rondas" element={<RondasPage />} />
              <Route path="ocorrencias" element={<OcorrenciasPage />} />
              <Route path="historico" element={<HistoricoPage />} />
              <Route path="auditoria" element={<AuditoriaPage />} />
              <Route path="configuracoes" element={<ConfiguracoesPage />} />
              <Route path="evolucoes" element={<EvolucoesPage />} />
            </Route>

            <Route path="/app" element={<ProtectedRoute><OperationalLayout /></ProtectedRoute>}>
              <Route index element={<AppHome />} />
              <Route path="rondas" element={<AppRondas />} />
              <Route path="rondas/:id/executar" element={<ExecutarRonda />} />
              <Route path="equipamentos" element={<AppEquipamentos />} />
              <Route path="ocorrencias" element={<AppOcorrencias />} />
              <Route path="ocorrencias/nova" element={<AppOcorrencias />} />
              <Route path="mais" element={<AppMais />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

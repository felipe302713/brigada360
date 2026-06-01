import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Shield } from 'lucide-react';

const DEMO_USERS = [
  { label: 'Entrar como administrador', usuario: 'admin', senha: 'admin' },
  { label: 'Entrar como líder', usuario: 'lider', senha: 'lider' },
  { label: 'Entrar como bombeiro', usuario: 'bombeiro', senha: 'bombeiro' },
  { label: 'Entrar como brigadista', usuario: 'brigadista', senha: 'brigadista' },
  { label: 'Entrar como socorrista', usuario: 'socorrista', senha: 'socorrista' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(usuario, senha);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (u: string, s: string) => {
    setUsuario(u);
    setSenha(s);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Shield size={48} color="#7B1E3A" style={{ marginBottom: 12 }} />
          <h1>Brigada360</h1>
          <p>Gestão Inteligente de Segurança Predial</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usuario">Usuário</label>
            <input
              id="usuario"
              type="text"
              className="form-control"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="password-toggle">
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-demo">
          <h3>Acessos para demonstração</h3>
          <div className="login-demo-buttons">
            {DEMO_USERS.map(d => (
              <button key={d.usuario} className="login-demo-btn" onClick={() => handleDemo(d.usuario, d.senha)}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

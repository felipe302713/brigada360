import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Auditoria } from '../../types';
import { Search } from 'lucide-react';

export function AuditoriaPage() {
  const [list, setList] = useState<Auditoria[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Auditoria[]>('/auditoria').then(d => { setList(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = list.filter(a =>
    !search || a.acao.toLowerCase().includes(search.toLowerCase()) ||
    a.entidade.toLowerCase().includes(search.toLowerCase()) ||
    (a.usuario?.nome_completo || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header"><h1>Auditoria</h1></div>
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9E9E9E' }} />
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Buscar por ação, entidade ou usuário..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="card">
        <div className="table-container">
          <table>
            <thead><tr><th>Data/Hora</th><th>Usuário</th><th>Ação</th><th>Entidade</th><th>ID</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>{new Date(a.created_at).toLocaleString('pt-BR')}</td>
                  <td>{a.usuario?.nome_completo || '-'}</td>
                  <td><span className="badge badge--blue">{a.acao}</span></td>
                  <td>{a.entidade}</td>
                  <td style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>{a.entidade_id?.slice(0, 8) || '-'}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9E9E9E' }}>Nenhum registro de auditoria</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

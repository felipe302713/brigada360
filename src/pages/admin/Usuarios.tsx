import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import type { Usuario, Perfil } from '../../types';
import { Plus, Search, Edit2, UserX, UserCheck, KeyRound, X } from 'lucide-react';

const PERFIS: Perfil[] = ['ADMIN', 'LIDER', 'BOMBEIRO', 'BRIGADISTA', 'SOCORRISTA'];
const EMPTY: Partial<Usuario> & { senha?: string } = {
  nome_completo: '', matricula: '', telefone: '', email: '', funcao: '',
  perfil: 'BOMBEIRO', plantao: '', turno: '', usuario_login: '',
};

export function UsuariosPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Usuario[]>([]);
  const [filtered, setFiltered] = useState<Usuario[]>([]);
  const [search, setSearch] = useState('');
  const [filterPerfil, setFilterPerfil] = useState('');
  const [form, setForm] = useState<typeof EMPTY | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get<Usuario[]>('/usuarios').then(d => { setList(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    let f = list;
    if (search) f = f.filter(u => u.nome_completo.toLowerCase().includes(search.toLowerCase()) || u.usuario_login.toLowerCase().includes(search.toLowerCase()));
    if (filterPerfil) f = f.filter(u => u.perfil === filterPerfil);
    setFiltered(f);
  }, [list, search, filterPerfil]);

  const handleSave = async () => {
    if (!form) return;
    try {
      if (editing) {
        await api.put(`/usuarios?id=${editing}`, form);
        toast('Usuário atualizado');
      } else {
        await api.post('/usuarios', { ...form, senha: form.senha || form.usuario_login });
        toast('Usuário cadastrado');
      }
      setForm(null); setEditing(null); load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  const toggleAtivo = async (u: Usuario) => {
    try {
      await api.put(`/usuarios?id=${u.id}`, { ativo: !u.ativo });
      toast(u.ativo ? 'Usuário inativado' : 'Usuário reativado');
      load();
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  const resetPassword = async (u: Usuario) => {
    try {
      await api.post(`/usuarios?id=${u.id}&action=reset-password`);
      toast('Senha restaurada ao padrão');
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', 'error'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Usuários</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ ...EMPTY }); setEditing(null); }}>
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9E9E9E' }} />
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Buscar por nome ou login..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={filterPerfil} onChange={e => setFilterPerfil(e.target.value)}>
          <option value="">Todos os perfis</option>
          {PERFIS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Nome</th><th>Login</th><th>Perfil</th><th>Função</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>{u.nome_completo}</td>
                  <td>{u.usuario_login}</td>
                  <td><span className="badge badge--blue">{u.perfil}</span></td>
                  <td>{u.funcao || '-'}</td>
                  <td><span className={`badge ${u.ativo ? 'badge--green' : 'badge--gray'}`}>{u.ativo ? 'Ativo' : 'Inativo'}</span></td>
                  <td style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => { setForm(u); setEditing(u.id); }} title="Editar"><Edit2 size={14} /></button>
                    <button className="btn btn-sm btn-secondary" onClick={() => toggleAtivo(u)} title={u.ativo ? 'Inativar' : 'Reativar'}>
                      {u.ativo ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => resetPassword(u)} title="Restaurar senha padrão"><KeyRound size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9E9E9E' }}>Nenhum usuário encontrado</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-content" style={{ maxWidth: 520, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setForm(null)}><X size={20} /></button>
            <h2 style={{ marginBottom: 20 }}>{editing ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            <div className="form-group"><label>Nome completo *</label><input className="form-control" value={form.nome_completo} onChange={e => setForm({ ...form, nome_completo: e.target.value })} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Login *</label><input className="form-control" value={form.usuario_login} onChange={e => setForm({ ...form, usuario_login: e.target.value })} disabled={!!editing} /></div>
              <div className="form-group"><label>Perfil *</label><select className="form-control" value={form.perfil} onChange={e => setForm({ ...form, perfil: e.target.value as Perfil })}>{PERFIS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Matrícula</label><input className="form-control" value={form.matricula || ''} onChange={e => setForm({ ...form, matricula: e.target.value })} /></div>
              <div className="form-group"><label>Função</label><input className="form-control" value={form.funcao || ''} onChange={e => setForm({ ...form, funcao: e.target.value })} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Telefone</label><input className="form-control" value={form.telefone || ''} onChange={e => setForm({ ...form, telefone: e.target.value })} /></div>
              <div className="form-group"><label>E-mail</label><input className="form-control" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>Plantão</label><input className="form-control" value={form.plantao || ''} onChange={e => setForm({ ...form, plantao: e.target.value })} /></div>
              <div className="form-group"><label>Turno</label><input className="form-control" value={form.turno || ''} onChange={e => setForm({ ...form, turno: e.target.value })} /></div>
            </div>
            {!editing && <div className="form-group"><label>Senha inicial</label><input className="form-control" value={form.senha || ''} onChange={e => setForm({ ...form, senha: e.target.value })} placeholder="Se vazio, usa o login" /></div>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setForm(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

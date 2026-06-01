import type { Context } from '@netlify/functions';
import { getAuthUser } from './auth-me.mts';
import { getDB } from './db.mts';

export default async (req: Request, _context: Context) => {
  const auth = getAuthUser(req);
  if (!auth) return Response.json({ message: 'Não autenticado' }, { status: 401 });

  const db = await getDB();
  const today = new Date().toISOString().split('T')[0];

  const usuarios_ativos = db.usuarios.filter(u => u.ativo).length;
  const profissionais_disponiveis = db.usuarios.filter(u => u.ativo && u.perfil !== 'ADMIN').length;
  const postos_ativos = db.postos.filter(p => p.ativo).length;

  const rondasHoje = db.rondas.filter(r => r.data_programada === today);
  const rondas_hoje = rondasHoje.length;
  const rondas_concluidas = rondasHoje.filter(r => r.status === 'concluida' || r.status === 'concluida_com_pendencia').length;
  const rondas_pendentes = rondasHoje.filter(r => r.status === 'pendente' || r.status === 'atrasada').length;

  const eqAtivos = db.equipamentos.filter(e => e.ativo);
  const equipamentos_total = eqAtivos.length;
  const equipamentos_regulares = eqAtivos.filter(e => e.status === 'regular').length;
  const equipamentos_proximo_vencimento = eqAtivos.filter(e => e.status === 'proximo_vencimento').length;
  const equipamentos_vencidos = eqAtivos.filter(e => e.status === 'vencido').length;

  const ocorrencias_abertas = db.ocorrencias.filter(o => o.status !== 'resolvida' && o.status !== 'cancelada').length;
  const ocorrencias_criticas = db.ocorrencias.filter(o => o.criticidade === 'critica' && o.status !== 'resolvida' && o.status !== 'cancelada').length;

  const alertas: any[] = [];

  eqAtivos.filter(e => e.status === 'vencido').forEach(e => {
    alertas.push({ tipo: 'equipamento_vencido', titulo: `${e.codigo} vencido`, descricao: `${e.tipo} em ${e.localizacao}`, criticidade: 'critico', entidade_id: e.id });
  });
  eqAtivos.filter(e => e.status === 'proximo_vencimento').forEach(e => {
    alertas.push({ tipo: 'equipamento_proximo', titulo: `${e.codigo} próx. vencimento`, descricao: `${e.tipo} em ${e.localizacao}`, criticidade: 'atencao', entidade_id: e.id });
  });
  db.ocorrencias.filter(o => o.criticidade === 'critica' && o.status !== 'resolvida' && o.status !== 'cancelada').forEach(o => {
    alertas.push({ tipo: 'ocorrencia_critica', titulo: `${o.numero} crítica`, descricao: o.descricao?.slice(0, 100) || '', criticidade: 'critico', entidade_id: o.id });
  });
  db.ocorrencias.filter(o => o.status === 'pendente').forEach(o => {
    alertas.push({ tipo: 'ocorrencia_pendente', titulo: `${o.numero} pendente`, descricao: o.tipo || '', criticidade: 'atencao', entidade_id: o.id });
  });

  return Response.json({
    usuarios_ativos, profissionais_disponiveis, postos_ativos,
    rondas_hoje, rondas_concluidas, rondas_pendentes,
    equipamentos_total, equipamentos_regulares, equipamentos_proximo_vencimento, equipamentos_vencidos,
    ocorrencias_abertas, ocorrencias_criticas, alertas,
  });
};

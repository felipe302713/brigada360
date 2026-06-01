import type { Plugin } from 'vite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

const SECRET = 'brigada360-dev-secret-key';

const PERFIL_SENHAS: Record<string, string> = { ADMIN: 'admin', LIDER: 'lider', BOMBEIRO: 'bombeiro', BRIGADISTA: 'brigadista', SOCORRISTA: 'socorrista' };

function hashPw(pw: string) { return bcrypt.hashSync(pw, 10); }

function buildSeed() {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];

  const SETOR_IDS: Record<string,string> = { base: 'a1-001', socorros: 'a1-002', cobertura: 'a1-003', teatro: 'a1-004', recepcao: 'a1-005', escadas: 'a1-006', subsolo: 'a1-007', estacionamento: 'a1-008' };
  const POSTO_IDS: Record<string,string> = { base: 'b1-001', socorros: 'b1-002', cobertura: 'b1-003', teatro: 'b1-004' };
  const checklistId = 'c1-001';
  const catIds = ['d1-001','d1-002','d1-003','d1-004','d1-005'];

  const adminId='u-001', liderId='u-002', bombeiroId='u-003', brigadistaId='u-004', socorristaId='u-005';
  const juliaId='u-006', anaId='u-007', brunoId='u-008', diegoId='u-009', fernandaId='u-010';

  const usuarios = [
    { id: adminId, nome_completo: 'Administrador Geral', matricula: 'ADM-001', telefone: '', email: 'admin@brigada360.com', funcao: 'Administrador', perfil: 'ADMIN', plantao: 'Diurno', turno: '08h-18h', usuario_login: 'admin', senha_hash: hashPw('admin'), ativo: true, created_at: now, updated_at: now },
    { id: liderId, nome_completo: 'Carlos Mendes', matricula: 'BC-001', telefone: '(21) 99999-0001', email: 'carlos@brigada360.com', funcao: 'Líder de Brigada', perfil: 'LIDER', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.base, usuario_login: 'lider', senha_hash: hashPw('lider'), ativo: true, created_at: now, updated_at: now },
    { id: bombeiroId, nome_completo: 'Rafael Souza', matricula: 'BC-002', telefone: '(21) 99999-0002', email: 'rafael@brigada360.com', funcao: 'Bombeiro Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.base, usuario_login: 'bombeiro', senha_hash: hashPw('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: brigadistaId, nome_completo: 'Lucas Ribeiro', matricula: 'BG-001', telefone: '(21) 99999-0004', email: 'lucas@brigada360.com', funcao: 'Brigadista', perfil: 'BRIGADISTA', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.teatro, usuario_login: 'brigadista', senha_hash: hashPw('brigadista'), ativo: true, created_at: now, updated_at: now },
    { id: socorristaId, nome_completo: 'Marcos Lima', matricula: 'SC-001', telefone: '(21) 99999-0005', email: 'marcos@brigada360.com', funcao: 'Socorrista', perfil: 'SOCORRISTA', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.socorros, usuario_login: 'socorrista', senha_hash: hashPw('socorrista'), ativo: true, created_at: now, updated_at: now },
    { id: juliaId, nome_completo: 'Júlia Ferreira', matricula: 'BC-003', funcao: 'Bombeira Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.base, usuario_login: 'julia', senha_hash: hashPw('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: anaId, nome_completo: 'Ana Paula', matricula: 'BC-004', funcao: 'Bombeira Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.socorros, usuario_login: 'ana', senha_hash: hashPw('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: brunoId, nome_completo: 'Bruno Alves', matricula: 'BC-005', funcao: 'Bombeiro Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.cobertura, usuario_login: 'bruno', senha_hash: hashPw('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: diegoId, nome_completo: 'Diego Santos', matricula: 'BC-006', funcao: 'Bombeiro Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.cobertura, usuario_login: 'diego', senha_hash: hashPw('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: fernandaId, nome_completo: 'Fernanda Rocha', matricula: 'BC-007', funcao: 'Bombeira Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.teatro, usuario_login: 'fernanda', senha_hash: hashPw('bombeiro'), ativo: true, created_at: now, updated_at: now },
  ];

  const setores = [
    { id: SETOR_IDS.base, nome: 'Base de Comando', descricao: 'Centro de operações da brigada', localizacao: 'Térreo - Sala 01', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.socorros, nome: 'Primeiros Socorros', descricao: 'Posto de atendimento médico', localizacao: 'Térreo - Sala 05', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.cobertura, nome: 'Cobertura', descricao: 'Área técnica e equipamentos', localizacao: 'Cobertura', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.teatro, nome: 'Caixa Cultural - Teatro', descricao: 'Anexo cultural com teatro', localizacao: 'Anexo - Bloco B', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.recepcao, nome: 'Recepção', descricao: 'Recepção principal', localizacao: 'Térreo', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.escadas, nome: 'Escadas e Rotas de Fuga', descricao: 'Escadas e corredores de emergência', localizacao: 'Todos os andares', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.subsolo, nome: 'Subsolo', descricao: 'Área do subsolo', localizacao: 'Subsolo', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.estacionamento, nome: 'Estacionamento', descricao: 'Estacionamento do edifício', localizacao: 'Subsolo e Térreo', ativo: true, created_at: now, updated_at: now },
  ];

  const postos = [
    { id: POSTO_IDS.base, setor_id: SETOR_IDS.base, nome: 'Base de Comando', localizacao: 'Térreo - Sala 01', quantidade_minima_profissionais: 3, ativo: true, created_at: now, updated_at: now },
    { id: POSTO_IDS.socorros, setor_id: SETOR_IDS.socorros, nome: 'Posto de Primeiros Socorros', localizacao: 'Térreo - Sala 05', quantidade_minima_profissionais: 2, ativo: true, created_at: now, updated_at: now },
    { id: POSTO_IDS.cobertura, setor_id: SETOR_IDS.cobertura, nome: 'Posto da Cobertura', localizacao: 'Cobertura', quantidade_minima_profissionais: 2, ativo: true, created_at: now, updated_at: now },
    { id: POSTO_IDS.teatro, setor_id: SETOR_IDS.teatro, nome: 'Anexo Caixa Cultural', localizacao: 'Anexo - Bloco B', quantidade_minima_profissionais: 2, ativo: true, created_at: now, updated_at: now },
  ];

  const checklists = [{ id: checklistId, nome: 'Ronda Geral do Edifício', descricao: 'Checklist padrão para ronda geral', ativo: true, created_at: now, updated_at: now }];

  const checklist_categorias = [
    { id: catIds[0], checklist_id: checklistId, nome: 'Base de Comando', ordem: 1 },
    { id: catIds[1], checklist_id: checklistId, nome: 'Térreo e Recepção', ordem: 2 },
    { id: catIds[2], checklist_id: checklistId, nome: 'Escadas e Rotas de Fuga', ordem: 3 },
    { id: catIds[3], checklist_id: checklistId, nome: 'Cobertura', ordem: 4 },
    { id: catIds[4], checklist_id: checklistId, nome: 'Anexo Caixa Cultural', ordem: 5 },
  ];

  let idx = 0;
  const mkId = () => `ei-${String(++idx).padStart(3,'0')}`;
  const items = [
    [catIds[0], ['Verificar rádio comunicador','Confirmar funcionamento do telefone de emergência','Verificar livro de ocorrências','Confirmar acesso às chaves de emergência']],
    [catIds[1], ['Verificar saídas de emergência','Confirmar sinalização visível','Verificar iluminação de emergência','Avaliar circulação de pessoas']],
    [catIds[2], ['Confirmar ausência de objetos bloqueando a passagem','Verificar portas corta-fogo','Confirmar sinalização das rotas','Avaliar iluminação']],
    [catIds[3], ['Verificar acesso','Avaliar condições da área técnica','Verificar equipamentos instalados','Registrar possíveis riscos']],
    [catIds[4], ['Verificar área do teatro','Avaliar circulação de público','Confirmar saídas de emergência','Conferir equipamentos de combate a incêndio','Registrar observações relevantes']],
  ] as [string, string[]][];

  const checklist_itens = items.flatMap(([catId, descs]) => descs.map((d, i) => ({ id: mkId(), categoria_id: catId, descricao: d, ordem: i+1, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true })));

  const equipamentos = [
    { id: 'f1-001', setor_id: SETOR_IDS.recepcao, codigo: 'EXT-001', tipo: 'Extintor de água pressurizada', classe: 'A', localizacao: 'Térreo - Recepção', data_instalacao: '2024-01-15', data_vencimento: '2026-12-15', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1-002', setor_id: SETOR_IDS.cobertura, codigo: 'EXT-018', tipo: 'Extintor de CO₂', classe: 'B e C', localizacao: 'Cobertura - Área Técnica', data_instalacao: '2023-06-10', data_vencimento: '2026-06-10', status: 'proximo_vencimento', ativo: true, created_at: now, updated_at: now },
    { id: 'f1-003', setor_id: SETOR_IDS.teatro, codigo: 'EXT-024', tipo: 'Extintor de pó químico seco', classe: 'ABC', localizacao: 'Anexo Caixa Cultural - Teatro', data_instalacao: '2023-05-20', data_vencimento: '2026-05-20', status: 'vencido', ativo: true, created_at: now, updated_at: now },
    { id: 'f1-004', setor_id: SETOR_IDS.base, codigo: 'HID-001', tipo: 'Hidrante', classe: '', localizacao: 'Térreo - Hall principal', data_instalacao: '2022-03-01', data_vencimento: '2027-03-01', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1-005', setor_id: SETOR_IDS.escadas, codigo: 'PCF-001', tipo: 'Porta corta-fogo', classe: '', localizacao: 'Escada principal - 1º andar', data_instalacao: '2021-08-15', data_vencimento: '2027-08-15', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1-006', setor_id: SETOR_IDS.recepcao, codigo: 'ILE-001', tipo: 'Iluminação de emergência', classe: '', localizacao: 'Térreo - Corredor principal', data_instalacao: '2023-11-01', data_vencimento: '2026-11-01', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1-007', setor_id: SETOR_IDS.subsolo, codigo: 'DET-001', tipo: 'Detector de fumaça', classe: '', localizacao: 'Subsolo - Área técnica', data_instalacao: '2024-02-20', data_vencimento: '2027-02-20', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1-008', setor_id: SETOR_IDS.estacionamento, codigo: 'ALR-001', tipo: 'Alarme', classe: '', localizacao: 'Estacionamento - Entrada', data_instalacao: '2023-09-10', data_vencimento: '2026-09-10', status: 'regular', ativo: true, created_at: now, updated_at: now },
  ];

  const rondas = [
    { id: 'g1-001', nome: 'Ronda das 09h30', checklist_id: checklistId, responsavel_id: liderId, data_programada: today, horario_programado: '09:30', status: 'concluida', percentual_conclusao: 100, data_inicio_execucao: `${today}T09:30:00`, data_fim_execucao: `${today}T10:15:00`, created_at: now, updated_at: now },
    { id: 'g1-002', nome: 'Ronda das 14h30', checklist_id: checklistId, data_programada: today, horario_programado: '14:30', status: 'pendente', percentual_conclusao: 0, created_at: now, updated_at: now },
    { id: 'g1-003', nome: 'Ronda das 16h30', checklist_id: checklistId, data_programada: today, horario_programado: '16:30', status: 'pendente', percentual_conclusao: 0, created_at: now, updated_at: now },
  ];

  const ocorrencias = [
    { id: 'h1-001', numero: 'OC-2026-001', tipo: 'Equipamento próximo do vencimento', setor_id: SETOR_IDS.cobertura, criticidade: 'media', status: 'em_acompanhamento', descricao: 'Extintor EXT-018 na cobertura está com vencimento próximo.', data_hora_abertura: '2026-05-28T10:30:00', created_at: now, updated_at: now },
    { id: 'h1-002', numero: 'OC-2026-002', tipo: 'Rota de fuga parcialmente obstruída', setor_id: SETOR_IDS.teatro, criticidade: 'alta', status: 'pendente', descricao: 'Materiais de cenografia obstruindo saída de emergência lateral do teatro.', data_hora_abertura: '2026-05-29T14:15:00', created_at: now, updated_at: now },
  ];

  return { usuarios, setores, postos, equipamentos, checklists, checklist_categorias, checklist_itens, rondas, ronda_respostas: [] as any[], ocorrencias, inspecoes_equipamentos: [] as any[], auditoria: [] as any[] };
}

let db = buildSeed();

function getAuth(req: any) {
  const cookie = req.headers?.cookie || '';
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;
  try { return jwt.verify(match[1], SECRET) as { id: string; perfil: string }; } catch { return null; }
}

function json(res: any, data: any, status = 200, headers: Record<string,string> = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  for (const [k,v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(data));
}

async function readBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: string) => { body += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
  });
}

export function brigada360DevApi(): Plugin {
  return {
    name: 'brigada360-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = new URL(req.url!, `http://localhost`);
        const path = url.pathname;

        if (!path.startsWith('/.netlify/functions/')) return next();

        const fn = path.replace('/.netlify/functions/', '');
        const method = req.method || 'GET';

        // AUTH-LOGIN
        if (fn === 'auth-login' && method === 'POST') {
          const { usuario, senha } = await readBody(req);
          const user = db.usuarios.find((u: any) => u.usuario_login === usuario && u.ativo);
          if (!user || !bcrypt.compareSync(senha, user.senha_hash)) return json(res, { message: 'Credenciais inválidas' }, 401);
          const token = jwt.sign({ id: user.id, perfil: user.perfil }, SECRET, { expiresIn: '8h' });
          return json(res, { user: { id: user.id, nome_completo: user.nome_completo, perfil: user.perfil, usuario_login: user.usuario_login } }, 200, { 'Set-Cookie': `token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800` });
        }

        // AUTH-LOGOUT
        if (fn === 'auth-logout') return json(res, { ok: true }, 200, { 'Set-Cookie': 'token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });

        // AUTH-ME
        if (fn === 'auth-me') {
          const auth = getAuth(req);
          if (!auth) return json(res, { message: 'Não autenticado' }, 401);
          const user = db.usuarios.find((u: any) => u.id === auth.id && u.ativo);
          if (!user) return json(res, { message: 'Não encontrado' }, 401);
          return json(res, { user: { id: user.id, nome_completo: user.nome_completo, perfil: user.perfil, usuario_login: user.usuario_login } });
        }

        const auth = getAuth(req);
        if (!auth) return json(res, { message: 'Não autenticado' }, 401);
        const id = url.searchParams.get('id');
        const action = url.searchParams.get('action');

        // DASHBOARD
        if (fn === 'dashboard') {
          const today = new Date().toISOString().split('T')[0];
          const eqAtivos = db.equipamentos.filter((e: any) => e.ativo);
          const rondasHoje = db.rondas.filter((r: any) => r.data_programada === today);
          const alertas: any[] = [];
          eqAtivos.filter((e: any) => e.status === 'vencido').forEach((e: any) => alertas.push({ tipo: 'equipamento_vencido', titulo: `${e.codigo} vencido`, descricao: `${e.tipo} em ${e.localizacao}`, criticidade: 'critico' }));
          eqAtivos.filter((e: any) => e.status === 'proximo_vencimento').forEach((e: any) => alertas.push({ tipo: 'equipamento_proximo', titulo: `${e.codigo} próx. vencimento`, descricao: `${e.tipo} em ${e.localizacao}`, criticidade: 'atencao' }));
          db.ocorrencias.filter((o: any) => o.status === 'pendente').forEach((o: any) => alertas.push({ tipo: 'ocorrencia_pendente', titulo: `${o.numero} pendente`, descricao: o.tipo, criticidade: 'atencao' }));
          return json(res, {
            usuarios_ativos: db.usuarios.filter((u: any) => u.ativo).length,
            profissionais_disponiveis: db.usuarios.filter((u: any) => u.ativo && u.perfil !== 'ADMIN').length,
            postos_ativos: db.postos.filter((p: any) => p.ativo).length,
            rondas_hoje: rondasHoje.length, rondas_concluidas: rondasHoje.filter((r: any) => r.status === 'concluida' || r.status === 'concluida_com_pendencia').length,
            rondas_pendentes: rondasHoje.filter((r: any) => r.status === 'pendente' || r.status === 'atrasada').length,
            equipamentos_total: eqAtivos.length, equipamentos_regulares: eqAtivos.filter((e: any) => e.status === 'regular').length,
            equipamentos_proximo_vencimento: eqAtivos.filter((e: any) => e.status === 'proximo_vencimento').length,
            equipamentos_vencidos: eqAtivos.filter((e: any) => e.status === 'vencido').length,
            ocorrencias_abertas: db.ocorrencias.filter((o: any) => o.status !== 'resolvida' && o.status !== 'cancelada').length,
            ocorrencias_criticas: db.ocorrencias.filter((o: any) => o.criticidade === 'critica' && o.status !== 'resolvida').length,
            alertas,
          });
        }

        // USUARIOS
        if (fn === 'usuarios') {
          if (action === 'restore-demo') { db = buildSeed(); return json(res, { ok: true }); }
          if (method === 'GET') return json(res, id ? db.usuarios.find((u: any) => u.id === id) : db.usuarios.map(({ senha_hash, ...u }: any) => u));
          if (method === 'POST' && id && action === 'reset-password') {
            const user = db.usuarios.find((u: any) => u.id === id);
            if (user) { user.senha_hash = hashPw(PERFIL_SENHAS[user.perfil] || user.usuario_login); }
            return json(res, { ok: true });
          }
          if (method === 'POST') { const data = await readBody(req); const n: any = { id: uuid(), ...data, senha_hash: hashPw(data.senha || data.usuario_login), ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; delete n.senha; db.usuarios.push(n); return json(res, n, 201); }
          if (method === 'PUT' && id) { const data = await readBody(req); const u: any = db.usuarios.find((u: any) => u.id === id); if (u) { Object.assign(u, data, { updated_at: new Date().toISOString() }); if (data.senha) { u.senha_hash = hashPw(data.senha); delete u.senha; } } return json(res, u); }
          if (method === 'DELETE' && id) { const u = db.usuarios.find((u: any) => u.id === id); if (u) u.ativo = false; return json(res, { ok: true }); }
        }

        // SETORES
        if (fn === 'setores') {
          if (method === 'GET') return json(res, id ? db.setores.find((s: any) => s.id === id) : db.setores);
          if (method === 'POST') { const data = await readBody(req); const n = { id: uuid(), ...data, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; db.setores.push(n); return json(res, n, 201); }
          if (method === 'PUT' && id) { const data = await readBody(req); const s = db.setores.find((s: any) => s.id === id); if (s) Object.assign(s, data, { updated_at: new Date().toISOString() }); return json(res, s); }
          if (method === 'DELETE' && id) { const s = db.setores.find((s: any) => s.id === id); if (s) s.ativo = false; return json(res, { ok: true }); }
        }

        // POSTOS
        if (fn === 'postos') {
          if (method === 'GET') return json(res, id ? db.postos.find((p: any) => p.id === id) : db.postos);
          if (method === 'POST') { const data = await readBody(req); const n = { id: uuid(), ...data, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; db.postos.push(n); return json(res, n, 201); }
          if (method === 'PUT' && id) { const data = await readBody(req); const p = db.postos.find((p: any) => p.id === id); if (p) Object.assign(p, data, { updated_at: new Date().toISOString() }); return json(res, p); }
          if (method === 'DELETE' && id) { const p = db.postos.find((p: any) => p.id === id); if (p) p.ativo = false; return json(res, { ok: true }); }
        }

        // EQUIPAMENTOS
        if (fn === 'equipamentos') {
          if (method === 'GET') return json(res, id ? db.equipamentos.find((e: any) => e.id === id) : db.equipamentos.filter((e: any) => e.ativo));
          if (method === 'POST') { const data = await readBody(req); const n: any = { id: uuid(), ...data, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; if (n.data_vencimento) { const d = Math.ceil((new Date(n.data_vencimento).getTime()-Date.now())/86400000); n.status = d<0?'vencido':d<=30?'proximo_vencimento':'regular'; } db.equipamentos.push(n); return json(res, n, 201); }
          if (method === 'PUT' && id) { const data = await readBody(req); const e: any = db.equipamentos.find((e: any) => e.id === id); if (e) { Object.assign(e, data, { updated_at: new Date().toISOString() }); if (e.data_vencimento) { const d = Math.ceil((new Date(e.data_vencimento).getTime()-Date.now())/86400000); e.status = d<0?'vencido':d<=30?'proximo_vencimento':'regular'; } } return json(res, e); }
          if (method === 'DELETE' && id) { const e = db.equipamentos.find((e: any) => e.id === id); if (e) e.ativo = false; return json(res, { ok: true }); }
        }

        // INSPECOES
        if (fn === 'inspecoes') {
          if (method === 'GET') return json(res, db.inspecoes_equipamentos.map((i: any) => ({ ...i, responsavel: db.usuarios.find((u: any) => u.id === i.responsavel_id), equipamento: db.equipamentos.find((e: any) => e.id === i.equipamento_id) })));
          if (method === 'POST') { const data = await readBody(req); const n = { id: uuid(), ...data, responsavel_id: data.responsavel_id || auth.id, data_hora_inspecao: new Date().toISOString(), created_at: new Date().toISOString() }; db.inspecoes_equipamentos.push(n); const eq: any = db.equipamentos.find((e: any) => e.id === data.equipamento_id); if (eq) { eq.data_ultima_inspecao = new Date().toISOString().split('T')[0]; if (data.resultado === 'em_manutencao') eq.status = 'em_manutencao'; } return json(res, n, 201); }
        }

        // CHECKLISTS
        if (fn === 'checklists') {
          const withDetails = (c: any) => ({ ...c, categorias: db.checklist_categorias.filter((cat: any) => cat.checklist_id === c.id).sort((a: any,b: any) => a.ordem-b.ordem).map((cat: any) => ({ ...cat, itens: db.checklist_itens.filter((i: any) => i.categoria_id === cat.id && i.ativo).sort((a: any,b: any) => a.ordem-b.ordem) })) });
          if (method === 'GET') return json(res, id ? withDetails(db.checklists.find((c: any) => c.id === id)) : db.checklists.map(withDetails));
          if (method === 'POST') { const data = await readBody(req); const n = { id: uuid(), ...data, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; db.checklists.push(n); return json(res, n, 201); }
          if (method === 'PUT' && id) { const data = await readBody(req); const c = db.checklists.find((c: any) => c.id === id); if (c) Object.assign(c, data, { updated_at: new Date().toISOString() }); return json(res, c); }
          if (method === 'DELETE' && id) { const c = db.checklists.find((c: any) => c.id === id); if (c) c.ativo = false; return json(res, { ok: true }); }
        }

        // RONDAS
        if (fn === 'rondas') {
          if (method === 'GET') {
            if (id) { const r = db.rondas.find((r: any) => r.id === id); return json(res, r ? { ...r, responsavel: db.usuarios.find((u: any) => u.id === r.responsavel_id) } : null); }
            return json(res, db.rondas.map((r: any) => ({ ...r, responsavel: db.usuarios.find((u: any) => u.id === r.responsavel_id) })));
          }
          if (method === 'POST' && id && action === 'iniciar') { const r: any = db.rondas.find((r: any) => r.id === id); if (r) { r.status = 'em_andamento'; r.responsavel_id = r.responsavel_id || auth.id; r.data_inicio_execucao = new Date().toISOString(); } return json(res, r); }
          if (method === 'POST' && id && action === 'finalizar') { const r: any = db.rondas.find((r: any) => r.id === id); if (r) { const hasIssue = db.ronda_respostas.filter((rr: any) => rr.ronda_id === id).some((rr: any) => rr.resultado === 'atencao' || rr.resultado === 'critico'); r.status = hasIssue ? 'concluida_com_pendencia' : 'concluida'; r.data_fim_execucao = new Date().toISOString(); r.percentual_conclusao = 100; } return json(res, r); }
          if (method === 'POST') { const data = await readBody(req); const n = { id: uuid(), ...data, status: 'pendente', percentual_conclusao: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; db.rondas.push(n); return json(res, n, 201); }
          if (method === 'PUT' && id) { const data = await readBody(req); const r = db.rondas.find((r: any) => r.id === id); if (r) Object.assign(r, data, { updated_at: new Date().toISOString() }); return json(res, r); }
        }

        // RONDA-RESPOSTAS
        if (fn === 'ronda-respostas') {
          const rondaId = url.searchParams.get('rondaId');
          if (method === 'GET') return json(res, rondaId ? db.ronda_respostas.filter((r: any) => r.ronda_id === rondaId) : []);
          if (method === 'POST') {
            const data = await readBody(req);
            const existing = db.ronda_respostas.find((r: any) => r.ronda_id === data.ronda_id && r.checklist_item_id === data.checklist_item_id);
            if (existing) { Object.assign(existing, data); return json(res, existing); }
            const n = { id: uuid(), ...data, data_hora_verificacao: new Date().toISOString(), created_at: new Date().toISOString() };
            db.ronda_respostas.push(n);
            const ronda: any = db.rondas.find((r: any) => r.id === data.ronda_id);
            if (ronda) {
              const cl = db.checklists.find((c: any) => c.id === ronda.checklist_id);
              if (cl) {
                const cats = db.checklist_categorias.filter((c: any) => c.checklist_id === cl.id);
                const total = cats.reduce((s: number, c: any) => s + db.checklist_itens.filter((i: any) => i.categoria_id === c.id && i.ativo).length, 0);
                const answered = db.ronda_respostas.filter((r: any) => r.ronda_id === data.ronda_id).length;
                ronda.percentual_conclusao = total > 0 ? Math.round((answered/total)*100) : 0;
              }
            }
            return json(res, n, 201);
          }
        }

        // OCORRENCIAS
        if (fn === 'ocorrencias') {
          if (method === 'GET') return json(res, id ? db.ocorrencias.find((o: any) => o.id === id) : db.ocorrencias);
          if (method === 'POST') { const data = await readBody(req); const yr = new Date().getFullYear(); const cnt = db.ocorrencias.filter((o: any) => o.numero.startsWith(`OC-${yr}`)).length + 1; const n = { id: uuid(), numero: `OC-${yr}-${String(cnt).padStart(3,'0')}`, ...data, responsavel_registro_id: auth.id, status: data.status || 'aberta', data_hora_abertura: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; db.ocorrencias.push(n); return json(res, n, 201); }
          if (method === 'PUT' && id) { const data = await readBody(req); const o: any = db.ocorrencias.find((o: any) => o.id === id); if (o) { Object.assign(o, data, { updated_at: new Date().toISOString() }); if (data.status === 'resolvida') o.data_hora_resolucao = new Date().toISOString(); } return json(res, o); }
        }

        // AUDITORIA
        if (fn === 'auditoria') {
          return json(res, db.auditoria.map((a: any) => ({ ...a, usuario: db.usuarios.find((u: any) => u.id === a.usuario_id) })).sort((a: any,b: any) => new Date(b.created_at).getTime()-new Date(a.created_at).getTime()));
        }

        return json(res, { message: 'Not found' }, 404);
      });
    }
  };
}

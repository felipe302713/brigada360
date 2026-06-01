import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

// In-memory database for local development
// In production, replace with @netlify/database PostgreSQL queries

interface DBStore {
  usuarios: any[];
  setores: any[];
  postos: any[];
  posto_profissionais: any[];
  equipamentos: any[];
  inspecoes_equipamentos: any[];
  checklists: any[];
  checklist_categorias: any[];
  checklist_itens: any[];
  rondas: any[];
  ronda_respostas: any[];
  ocorrencias: any[];
  ocorrencia_historicos: any[];
  auditoria: any[];
}

const SETOR_IDS = {
  base: 'a1000000-0000-0000-0000-000000000001',
  socorros: 'a1000000-0000-0000-0000-000000000002',
  cobertura: 'a1000000-0000-0000-0000-000000000003',
  teatro: 'a1000000-0000-0000-0000-000000000004',
  recepcao: 'a1000000-0000-0000-0000-000000000005',
  escadas: 'a1000000-0000-0000-0000-000000000006',
  subsolo: 'a1000000-0000-0000-0000-000000000007',
  estacionamento: 'a1000000-0000-0000-0000-000000000008',
};

const POSTO_IDS = {
  base: 'b1000000-0000-0000-0000-000000000001',
  socorros: 'b1000000-0000-0000-0000-000000000002',
  cobertura: 'b1000000-0000-0000-0000-000000000003',
  teatro: 'b1000000-0000-0000-0000-000000000004',
};

async function buildSeed(): Promise<DBStore> {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];

  const hashPassword = (pw: string) => bcrypt.hashSync(pw, 10);

  const adminId = 'u0000000-0000-0000-0000-000000000001';
  const liderId = 'u0000000-0000-0000-0000-000000000002';
  const bombeiroId = 'u0000000-0000-0000-0000-000000000003';
  const brigadistaId = 'u0000000-0000-0000-0000-000000000004';
  const socorristaId = 'u0000000-0000-0000-0000-000000000005';
  const juliaId = 'u0000000-0000-0000-0000-000000000006';
  const anaId = 'u0000000-0000-0000-0000-000000000007';
  const brunoId = 'u0000000-0000-0000-0000-000000000008';
  const diegoId = 'u0000000-0000-0000-0000-000000000009';
  const fernandaId = 'u0000000-0000-0000-0000-000000000010';

  const usuarios = [
    { id: adminId, nome_completo: 'Administrador Geral', matricula: 'ADM-001', telefone: '', email: 'admin@brigada360.com', funcao: 'Administrador', perfil: 'ADMIN', plantao: 'Diurno', turno: '08h-18h', usuario_login: 'admin', senha_hash: hashPassword('admin'), ativo: true, created_at: now, updated_at: now },
    { id: liderId, nome_completo: 'Carlos Mendes', matricula: 'BC-001', telefone: '(21) 99999-0001', email: 'carlos@brigada360.com', funcao: 'Líder de Brigada', perfil: 'LIDER', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.base, usuario_login: 'lider', senha_hash: hashPassword('lider'), ativo: true, created_at: now, updated_at: now },
    { id: bombeiroId, nome_completo: 'Rafael Souza', matricula: 'BC-002', telefone: '(21) 99999-0002', email: 'rafael@brigada360.com', funcao: 'Bombeiro Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.base, usuario_login: 'bombeiro', senha_hash: hashPassword('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: brigadistaId, nome_completo: 'Lucas Ribeiro', matricula: 'BG-001', telefone: '(21) 99999-0004', email: 'lucas@brigada360.com', funcao: 'Brigadista', perfil: 'BRIGADISTA', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.teatro, usuario_login: 'brigadista', senha_hash: hashPassword('brigadista'), ativo: true, created_at: now, updated_at: now },
    { id: socorristaId, nome_completo: 'Marcos Lima', matricula: 'SC-001', telefone: '(21) 99999-0005', email: 'marcos@brigada360.com', funcao: 'Socorrista', perfil: 'SOCORRISTA', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.socorros, usuario_login: 'socorrista', senha_hash: hashPassword('socorrista'), ativo: true, created_at: now, updated_at: now },
    { id: juliaId, nome_completo: 'Júlia Ferreira', matricula: 'BC-003', funcao: 'Bombeira Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.base, usuario_login: 'julia', senha_hash: hashPassword('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: anaId, nome_completo: 'Ana Paula', matricula: 'BC-004', funcao: 'Bombeira Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.socorros, usuario_login: 'ana', senha_hash: hashPassword('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: brunoId, nome_completo: 'Bruno Alves', matricula: 'BC-005', funcao: 'Bombeiro Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.cobertura, usuario_login: 'bruno', senha_hash: hashPassword('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: diegoId, nome_completo: 'Diego Santos', matricula: 'BC-006', funcao: 'Bombeiro Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.cobertura, usuario_login: 'diego', senha_hash: hashPassword('bombeiro'), ativo: true, created_at: now, updated_at: now },
    { id: fernandaId, nome_completo: 'Fernanda Rocha', matricula: 'BC-007', funcao: 'Bombeira Civil', perfil: 'BOMBEIRO', plantao: 'A', turno: '07h-19h', posto_atual_id: POSTO_IDS.teatro, usuario_login: 'fernanda', senha_hash: hashPassword('bombeiro'), ativo: true, created_at: now, updated_at: now },
  ];

  const setores = [
    { id: SETOR_IDS.base, nome: 'Base de Comando', descricao: 'Centro de operações da brigada', localizacao: 'Térreo - Sala 01', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.socorros, nome: 'Primeiros Socorros', descricao: 'Posto de atendimento médico', localizacao: 'Térreo - Sala 05', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.cobertura, nome: 'Cobertura', descricao: 'Área técnica e equipamentos', localizacao: 'Cobertura', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.teatro, nome: 'Caixa Cultural - Teatro', descricao: 'Anexo cultural com teatro', localizacao: 'Anexo - Bloco B', ativo: true, created_at: now, updated_at: now },
    { id: SETOR_IDS.recepcao, nome: 'Recepção', descricao: 'Recepção principal do edifício', localizacao: 'Térreo', ativo: true, created_at: now, updated_at: now },
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

  const posto_profissionais = [
    { id: uuid(), posto_id: POSTO_IDS.base, usuario_id: liderId, plantao: 'A', turno: '07h-19h', status_operacional: 'ativo', created_at: now, updated_at: now },
    { id: uuid(), posto_id: POSTO_IDS.base, usuario_id: bombeiroId, plantao: 'A', turno: '07h-19h', status_operacional: 'ativo', created_at: now, updated_at: now },
    { id: uuid(), posto_id: POSTO_IDS.base, usuario_id: juliaId, plantao: 'A', turno: '07h-19h', status_operacional: 'ativo', created_at: now, updated_at: now },
    { id: uuid(), posto_id: POSTO_IDS.socorros, usuario_id: socorristaId, plantao: 'A', turno: '07h-19h', status_operacional: 'ativo', created_at: now, updated_at: now },
    { id: uuid(), posto_id: POSTO_IDS.socorros, usuario_id: anaId, plantao: 'A', turno: '07h-19h', status_operacional: 'ativo', created_at: now, updated_at: now },
    { id: uuid(), posto_id: POSTO_IDS.cobertura, usuario_id: brunoId, plantao: 'A', turno: '07h-19h', status_operacional: 'ativo', created_at: now, updated_at: now },
    { id: uuid(), posto_id: POSTO_IDS.cobertura, usuario_id: diegoId, plantao: 'A', turno: '07h-19h', status_operacional: 'ativo', created_at: now, updated_at: now },
    { id: uuid(), posto_id: POSTO_IDS.teatro, usuario_id: fernandaId, plantao: 'A', turno: '07h-19h', status_operacional: 'ativo', created_at: now, updated_at: now },
    { id: uuid(), posto_id: POSTO_IDS.teatro, usuario_id: brigadistaId, plantao: 'A', turno: '07h-19h', status_operacional: 'ativo', created_at: now, updated_at: now },
  ];

  const checklistId = 'c1000000-0000-0000-0000-000000000001';
  const catIds = ['d1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000005'];

  const checklists = [{ id: checklistId, nome: 'Ronda Geral do Edifício', descricao: 'Checklist padrão para ronda geral de inspeção', ativo: true, created_at: now, updated_at: now }];

  const checklist_categorias = [
    { id: catIds[0], checklist_id: checklistId, nome: 'Base de Comando', ordem: 1, created_at: now, updated_at: now },
    { id: catIds[1], checklist_id: checklistId, nome: 'Térreo e Recepção', ordem: 2, created_at: now, updated_at: now },
    { id: catIds[2], checklist_id: checklistId, nome: 'Escadas e Rotas de Fuga', ordem: 3, created_at: now, updated_at: now },
    { id: catIds[3], checklist_id: checklistId, nome: 'Cobertura', ordem: 4, created_at: now, updated_at: now },
    { id: catIds[4], checklist_id: checklistId, nome: 'Anexo Caixa Cultural', ordem: 5, created_at: now, updated_at: now },
  ];

  let itemIdx = 1;
  const makeItemId = () => `e1000000-0000-0000-0000-${String(itemIdx++).padStart(12, '0')}`;
  const checklist_itens = [
    { id: makeItemId(), categoria_id: catIds[0], descricao: 'Verificar rádio comunicador', ordem: 1, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[0], descricao: 'Confirmar funcionamento do telefone de emergência', ordem: 2, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[0], descricao: 'Verificar livro de ocorrências', ordem: 3, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[0], descricao: 'Confirmar acesso às chaves de emergência', ordem: 4, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[1], descricao: 'Verificar saídas de emergência', ordem: 1, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[1], descricao: 'Confirmar sinalização visível', ordem: 2, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[1], descricao: 'Verificar iluminação de emergência', ordem: 3, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[1], descricao: 'Avaliar circulação de pessoas', ordem: 4, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[2], descricao: 'Confirmar ausência de objetos bloqueando a passagem', ordem: 1, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[2], descricao: 'Verificar portas corta-fogo', ordem: 2, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[2], descricao: 'Confirmar sinalização das rotas', ordem: 3, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[2], descricao: 'Avaliar iluminação', ordem: 4, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[3], descricao: 'Verificar acesso', ordem: 1, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[3], descricao: 'Avaliar condições da área técnica', ordem: 2, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[3], descricao: 'Verificar equipamentos instalados', ordem: 3, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[3], descricao: 'Registrar possíveis riscos', ordem: 4, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[4], descricao: 'Verificar área do teatro', ordem: 1, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[4], descricao: 'Avaliar circulação de público', ordem: 2, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[4], descricao: 'Confirmar saídas de emergência', ordem: 3, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[4], descricao: 'Conferir equipamentos de combate a incêndio', ordem: 4, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
    { id: makeItemId(), categoria_id: catIds[4], descricao: 'Registrar observações relevantes', ordem: 5, obrigatorio: true, exige_observacao_irregularidade: true, ativo: true, created_at: now, updated_at: now },
  ];

  const equipamentos = [
    { id: 'f1000000-0000-0000-0000-000000000001', setor_id: SETOR_IDS.recepcao, codigo: 'EXT-001', tipo: 'Extintor de água pressurizada', classe: 'A', localizacao: 'Térreo - Recepção', data_instalacao: '2024-01-15', data_vencimento: '2026-12-15', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1000000-0000-0000-0000-000000000002', setor_id: SETOR_IDS.cobertura, codigo: 'EXT-018', tipo: 'Extintor de CO₂', classe: 'B e C', localizacao: 'Cobertura - Área Técnica', data_instalacao: '2023-06-10', data_vencimento: '2026-06-10', status: 'proximo_vencimento', ativo: true, created_at: now, updated_at: now },
    { id: 'f1000000-0000-0000-0000-000000000003', setor_id: SETOR_IDS.teatro, codigo: 'EXT-024', tipo: 'Extintor de pó químico seco', classe: 'ABC', localizacao: 'Anexo Caixa Cultural - Teatro', data_instalacao: '2023-05-20', data_vencimento: '2026-05-20', status: 'vencido', ativo: true, created_at: now, updated_at: now },
    { id: 'f1000000-0000-0000-0000-000000000004', setor_id: SETOR_IDS.base, codigo: 'HID-001', tipo: 'Hidrante', classe: '', localizacao: 'Térreo - Hall principal', data_instalacao: '2022-03-01', data_vencimento: '2027-03-01', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1000000-0000-0000-0000-000000000005', setor_id: SETOR_IDS.escadas, codigo: 'PCF-001', tipo: 'Porta corta-fogo', classe: '', localizacao: 'Escada principal - 1º andar', data_instalacao: '2021-08-15', data_vencimento: '2027-08-15', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1000000-0000-0000-0000-000000000006', setor_id: SETOR_IDS.recepcao, codigo: 'ILE-001', tipo: 'Iluminação de emergência', classe: '', localizacao: 'Térreo - Corredor principal', data_instalacao: '2023-11-01', data_vencimento: '2026-11-01', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1000000-0000-0000-0000-000000000007', setor_id: SETOR_IDS.subsolo, codigo: 'DET-001', tipo: 'Detector de fumaça', classe: '', localizacao: 'Subsolo - Área técnica', data_instalacao: '2024-02-20', data_vencimento: '2027-02-20', status: 'regular', ativo: true, created_at: now, updated_at: now },
    { id: 'f1000000-0000-0000-0000-000000000008', setor_id: SETOR_IDS.estacionamento, codigo: 'ALR-001', tipo: 'Alarme', classe: '', localizacao: 'Estacionamento - Entrada', data_instalacao: '2023-09-10', data_vencimento: '2026-09-10', status: 'regular', ativo: true, created_at: now, updated_at: now },
  ];

  const rondas = [
    { id: 'g1000000-0000-0000-0000-000000000001', nome: 'Ronda das 09h30', checklist_id: checklistId, responsavel_id: liderId, data_programada: today, horario_programado: '09:30', status: 'concluida', percentual_conclusao: 100, data_inicio_execucao: `${today}T09:30:00`, data_fim_execucao: `${today}T10:15:00`, created_at: now, updated_at: now },
    { id: 'g1000000-0000-0000-0000-000000000002', nome: 'Ronda das 14h30', checklist_id: checklistId, data_programada: today, horario_programado: '14:30', status: 'pendente', percentual_conclusao: 0, created_at: now, updated_at: now },
    { id: 'g1000000-0000-0000-0000-000000000003', nome: 'Ronda das 16h30', checklist_id: checklistId, data_programada: today, horario_programado: '16:30', status: 'pendente', percentual_conclusao: 0, created_at: now, updated_at: now },
  ];

  const ocorrencias = [
    { id: 'h1000000-0000-0000-0000-000000000001', numero: 'OC-2026-001', tipo: 'Equipamento próximo do vencimento', setor_id: SETOR_IDS.cobertura, criticidade: 'media', status: 'em_acompanhamento', descricao: 'Extintor EXT-018 na cobertura está com vencimento próximo. Necessário agendar recarga.', data_hora_abertura: '2026-05-28T10:30:00', created_at: now, updated_at: now },
    { id: 'h1000000-0000-0000-0000-000000000002', numero: 'OC-2026-002', tipo: 'Rota de fuga parcialmente obstruída', setor_id: SETOR_IDS.teatro, criticidade: 'alta', status: 'pendente', descricao: 'Materiais de cenografia parcialmente obstruindo saída de emergência lateral do teatro.', data_hora_abertura: '2026-05-29T14:15:00', created_at: now, updated_at: now },
  ];

  return {
    usuarios,
    setores,
    postos,
    posto_profissionais,
    equipamentos,
    inspecoes_equipamentos: [],
    checklists,
    checklist_categorias,
    checklist_itens,
    rondas,
    ronda_respostas: [],
    ocorrencias,
    ocorrencia_historicos: [],
    auditoria: [],
  };
}

let _db: DBStore | null = null;

export async function getDB(): Promise<DBStore> {
  if (!_db) {
    _db = await buildSeed();
  }
  return _db;
}

export async function resetDB(): Promise<void> {
  _db = await buildSeed();
}

export { uuid };

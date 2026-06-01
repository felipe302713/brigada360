export type Perfil = 'ADMIN' | 'LIDER' | 'BOMBEIRO' | 'BRIGADISTA' | 'SOCORRISTA';

export interface Usuario {
  id: string;
  nome_completo: string;
  matricula?: string;
  telefone?: string;
  email?: string;
  data_nascimento?: string;
  funcao?: string;
  perfil: Perfil;
  plantao?: string;
  turno?: string;
  posto_atual_id?: string;
  usuario_login: string;
  ativo: boolean;
  ultimo_acesso?: string;
  created_at: string;
  updated_at: string;
}

export interface Setor {
  id: string;
  nome: string;
  descricao?: string;
  localizacao?: string;
  telefone?: string;
  ramal?: string;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Posto {
  id: string;
  setor_id: string;
  nome: string;
  localizacao?: string;
  quantidade_minima_profissionais: number;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  setor?: Setor;
  profissionais?: PostoProfissional[];
}

export interface PostoProfissional {
  id: string;
  posto_id: string;
  usuario_id: string;
  plantao?: string;
  turno?: string;
  status_operacional: string;
  usuario?: Usuario;
}

export interface Equipamento {
  id: string;
  setor_id?: string;
  codigo: string;
  tipo: string;
  classe?: string;
  localizacao?: string;
  data_instalacao?: string;
  data_ultima_inspecao?: string;
  data_vencimento?: string;
  status: 'regular' | 'proximo_vencimento' | 'vencido' | 'em_manutencao' | 'inativo';
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  setor?: Setor;
}

export interface InspecaoEquipamento {
  id: string;
  equipamento_id: string;
  responsavel_id: string;
  data_hora_inspecao: string;
  resultado: 'regular' | 'atencao' | 'critico' | 'em_manutencao';
  observacao?: string;
  created_at: string;
  responsavel?: Usuario;
  equipamento?: Equipamento;
}

export interface Checklist {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  categorias?: ChecklistCategoria[];
}

export interface ChecklistCategoria {
  id: string;
  checklist_id: string;
  nome: string;
  ordem: number;
  itens?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  categoria_id: string;
  descricao: string;
  ordem: number;
  obrigatorio: boolean;
  exige_observacao_irregularidade: boolean;
  ativo: boolean;
}

export type StatusRonda = 'pendente' | 'em_andamento' | 'concluida' | 'concluida_com_pendencia' | 'atrasada';

export interface Ronda {
  id: string;
  nome: string;
  checklist_id: string;
  responsavel_id?: string;
  data_programada: string;
  horario_programado: string;
  status: StatusRonda;
  percentual_conclusao: number;
  data_inicio_execucao?: string;
  data_fim_execucao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  checklist?: Checklist;
  responsavel?: Usuario;
  setores?: Setor[];
}

export interface RondaResposta {
  id: string;
  ronda_id: string;
  checklist_item_id: string;
  responsavel_id: string;
  resultado: 'regular' | 'atencao' | 'critico' | 'nao_se_aplica';
  observacao?: string;
  data_hora_verificacao: string;
}

export type CriticidadeOcorrencia = 'baixa' | 'media' | 'alta' | 'critica';
export type StatusOcorrencia = 'aberta' | 'pendente' | 'em_acompanhamento' | 'resolvida' | 'cancelada';

export interface Ocorrencia {
  id: string;
  numero: string;
  tipo?: string;
  setor_id?: string;
  equipamento_id?: string;
  responsavel_registro_id?: string;
  responsavel_atendimento_id?: string;
  criticidade: CriticidadeOcorrencia;
  status: StatusOcorrencia;
  descricao?: string;
  data_hora_abertura: string;
  data_hora_resolucao?: string;
  created_at: string;
  updated_at: string;
  setor?: Setor;
  equipamento?: Equipamento;
  responsavel_registro?: Usuario;
  responsavel_atendimento?: Usuario;
}

export interface Auditoria {
  id: string;
  usuario_id: string;
  acao: string;
  entidade: string;
  entidade_id?: string;
  dados_anteriores?: Record<string, unknown>;
  dados_novos?: Record<string, unknown>;
  created_at: string;
  usuario?: Usuario;
}

export interface DashboardData {
  usuarios_ativos: number;
  profissionais_disponiveis: number;
  postos_ativos: number;
  rondas_hoje: number;
  rondas_concluidas: number;
  rondas_pendentes: number;
  equipamentos_total: number;
  equipamentos_regulares: number;
  equipamentos_proximo_vencimento: number;
  equipamentos_vencidos: number;
  ocorrencias_abertas: number;
  ocorrencias_criticas: number;
  alertas: Alerta[];
}

export interface Alerta {
  tipo: 'equipamento_vencido' | 'equipamento_proximo' | 'ronda_atrasada' | 'ocorrencia_critica' | 'ocorrencia_pendente';
  titulo: string;
  descricao: string;
  criticidade: 'info' | 'atencao' | 'critico';
  entidade_id?: string;
}

export interface AuthUser {
  id: string;
  nome_completo: string;
  perfil: Perfil;
  usuario_login: string;
}

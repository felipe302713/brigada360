-- Brigada360 - Schema Inicial MVP
-- Migration 001: Criação das tabelas principais

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo VARCHAR(255) NOT NULL,
  matricula VARCHAR(50),
  telefone VARCHAR(20),
  email VARCHAR(255),
  data_nascimento DATE,
  funcao VARCHAR(100),
  perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('ADMIN', 'LIDER', 'BOMBEIRO', 'BRIGADISTA', 'SOCORRISTA')),
  plantao VARCHAR(50),
  turno VARCHAR(50),
  posto_atual_id UUID,
  usuario_login VARCHAR(100) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setores
CREATE TABLE IF NOT EXISTS setores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  localizacao VARCHAR(255),
  telefone VARCHAR(20),
  ramal VARCHAR(20),
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Postos
CREATE TABLE IF NOT EXISTS postos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setor_id UUID REFERENCES setores(id),
  nome VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255),
  quantidade_minima_profissionais INTEGER DEFAULT 1,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posto-Profissionais (vínculo)
CREATE TABLE IF NOT EXISTS posto_profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posto_id UUID REFERENCES postos(id),
  usuario_id UUID REFERENCES usuarios(id),
  plantao VARCHAR(50),
  turno VARCHAR(50),
  status_operacional VARCHAR(50) DEFAULT 'ativo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipamentos
CREATE TABLE IF NOT EXISTS equipamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setor_id UUID REFERENCES setores(id),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  classe VARCHAR(50),
  localizacao VARCHAR(255),
  data_instalacao DATE,
  data_ultima_inspecao DATE,
  data_vencimento DATE,
  status VARCHAR(50) DEFAULT 'regular' CHECK (status IN ('regular', 'proximo_vencimento', 'vencido', 'em_manutencao', 'inativo')),
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspeções de Equipamentos
CREATE TABLE IF NOT EXISTS inspecoes_equipamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipamento_id UUID REFERENCES equipamentos(id),
  responsavel_id UUID REFERENCES usuarios(id),
  data_hora_inspecao TIMESTAMPTZ DEFAULT NOW(),
  resultado VARCHAR(50) CHECK (resultado IN ('regular', 'atencao', 'critico', 'em_manutencao')),
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklists
CREATE TABLE IF NOT EXISTS checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist Categorias
CREATE TABLE IF NOT EXISTS checklist_categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID REFERENCES checklists(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist Itens
CREATE TABLE IF NOT EXISTS checklist_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES checklist_categorias(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  obrigatorio BOOLEAN DEFAULT true,
  exige_observacao_irregularidade BOOLEAN DEFAULT true,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rondas
CREATE TABLE IF NOT EXISTS rondas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  checklist_id UUID REFERENCES checklists(id),
  responsavel_id UUID REFERENCES usuarios(id),
  data_programada DATE,
  horario_programado TIME,
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'concluida_com_pendencia', 'atrasada')),
  percentual_conclusao DECIMAL(5,2) DEFAULT 0,
  data_inicio_execucao TIMESTAMPTZ,
  data_fim_execucao TIMESTAMPTZ,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ronda-Setores
CREATE TABLE IF NOT EXISTS ronda_setores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ronda_id UUID REFERENCES rondas(id) ON DELETE CASCADE,
  setor_id UUID REFERENCES setores(id)
);

-- Ronda Respostas
CREATE TABLE IF NOT EXISTS ronda_respostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ronda_id UUID REFERENCES rondas(id) ON DELETE CASCADE,
  checklist_item_id UUID REFERENCES checklist_itens(id),
  responsavel_id UUID REFERENCES usuarios(id),
  resultado VARCHAR(50) CHECK (resultado IN ('regular', 'atencao', 'critico', 'nao_se_aplica')),
  observacao TEXT,
  data_hora_verificacao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ocorrências
CREATE TABLE IF NOT EXISTS ocorrencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(20) UNIQUE NOT NULL,
  tipo VARCHAR(255),
  setor_id UUID REFERENCES setores(id),
  equipamento_id UUID REFERENCES equipamentos(id),
  responsavel_registro_id UUID REFERENCES usuarios(id),
  responsavel_atendimento_id UUID REFERENCES usuarios(id),
  criticidade VARCHAR(20) CHECK (criticidade IN ('baixa', 'media', 'alta', 'critica')),
  status VARCHAR(50) DEFAULT 'aberta' CHECK (status IN ('aberta', 'pendente', 'em_acompanhamento', 'resolvida', 'cancelada')),
  descricao TEXT,
  data_hora_abertura TIMESTAMPTZ DEFAULT NOW(),
  data_hora_resolucao TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ocorrência Históricos
CREATE TABLE IF NOT EXISTS ocorrencia_historicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ocorrencia_id UUID REFERENCES ocorrencias(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id),
  status_anterior VARCHAR(50),
  status_novo VARCHAR(50),
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auditoria
CREATE TABLE IF NOT EXISTS auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  acao VARCHAR(100) NOT NULL,
  entidade VARCHAR(100),
  entidade_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FK posto_atual em usuarios
ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_posto_atual FOREIGN KEY (posto_atual_id) REFERENCES postos(id);

-- Brigada360 - Índices
-- Migration 002

CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX IF NOT EXISTS idx_usuarios_login ON usuarios(usuario_login);

CREATE INDEX IF NOT EXISTS idx_setores_ativo ON setores(ativo);

CREATE INDEX IF NOT EXISTS idx_postos_setor ON postos(setor_id);
CREATE INDEX IF NOT EXISTS idx_postos_ativo ON postos(ativo);

CREATE INDEX IF NOT EXISTS idx_posto_prof_posto ON posto_profissionais(posto_id);
CREATE INDEX IF NOT EXISTS idx_posto_prof_usuario ON posto_profissionais(usuario_id);

CREATE INDEX IF NOT EXISTS idx_equipamentos_setor ON equipamentos(setor_id);
CREATE INDEX IF NOT EXISTS idx_equipamentos_codigo ON equipamentos(codigo);
CREATE INDEX IF NOT EXISTS idx_equipamentos_tipo ON equipamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_equipamentos_status ON equipamentos(status);
CREATE INDEX IF NOT EXISTS idx_equipamentos_vencimento ON equipamentos(data_vencimento);

CREATE INDEX IF NOT EXISTS idx_inspecoes_equip ON inspecoes_equipamentos(equipamento_id);
CREATE INDEX IF NOT EXISTS idx_inspecoes_resp ON inspecoes_equipamentos(responsavel_id);

CREATE INDEX IF NOT EXISTS idx_checklist_cat_checklist ON checklist_categorias(checklist_id);
CREATE INDEX IF NOT EXISTS idx_checklist_itens_cat ON checklist_itens(categoria_id);

CREATE INDEX IF NOT EXISTS idx_rondas_checklist ON rondas(checklist_id);
CREATE INDEX IF NOT EXISTS idx_rondas_responsavel ON rondas(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_rondas_status ON rondas(status);
CREATE INDEX IF NOT EXISTS idx_rondas_data ON rondas(data_programada);

CREATE INDEX IF NOT EXISTS idx_ronda_resp_ronda ON ronda_respostas(ronda_id);

CREATE INDEX IF NOT EXISTS idx_ocorrencias_setor ON ocorrencias(setor_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_status ON ocorrencias(status);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_criticidade ON ocorrencias(criticidade);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_numero ON ocorrencias(numero);

CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_entidade ON auditoria(entidade);
CREATE INDEX IF NOT EXISTS idx_auditoria_created ON auditoria(created_at);

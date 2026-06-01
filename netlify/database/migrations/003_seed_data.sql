-- Brigada360 - Dados Iniciais de Demonstração
-- Migration 003: Seed

-- Senhas: hash bcrypt do respectivo perfil em minúsculas
-- admin=$2a$10$... lider=$2a$10$... etc.
-- (Os hashes reais serão gerados pelo script de seed em JS)

-- Setores
INSERT INTO setores (id, nome, descricao, localizacao) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Base de Comando', 'Centro de operações da brigada', 'Térreo - Sala 01'),
  ('a1000000-0000-0000-0000-000000000002', 'Primeiros Socorros', 'Posto de atendimento médico', 'Térreo - Sala 05'),
  ('a1000000-0000-0000-0000-000000000003', 'Cobertura', 'Área técnica e equipamentos', 'Cobertura'),
  ('a1000000-0000-0000-0000-000000000004', 'Caixa Cultural - Teatro', 'Anexo cultural com teatro', 'Anexo - Bloco B'),
  ('a1000000-0000-0000-0000-000000000005', 'Recepção', 'Recepção principal do edifício', 'Térreo'),
  ('a1000000-0000-0000-0000-000000000006', 'Escadas e Rotas de Fuga', 'Escadas e corredores de emergência', 'Todos os andares'),
  ('a1000000-0000-0000-0000-000000000007', 'Subsolo', 'Área do subsolo', 'Subsolo'),
  ('a1000000-0000-0000-0000-000000000008', 'Estacionamento', 'Estacionamento do edifício', 'Subsolo e Térreo')
ON CONFLICT DO NOTHING;

-- Postos
INSERT INTO postos (id, setor_id, nome, localizacao, quantidade_minima_profissionais) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Base de Comando', 'Térreo - Sala 01', 3),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'Posto de Primeiros Socorros', 'Térreo - Sala 05', 2),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Posto da Cobertura', 'Cobertura', 2),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', 'Anexo Caixa Cultural', 'Anexo - Bloco B', 2)
ON CONFLICT DO NOTHING;

-- Checklist: Ronda Geral do Edifício
INSERT INTO checklists (id, nome, descricao) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Ronda Geral do Edifício', 'Checklist padrão para ronda geral de inspeção')
ON CONFLICT DO NOTHING;

-- Categorias do checklist
INSERT INTO checklist_categorias (id, checklist_id, nome, ordem) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Base de Comando', 1),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Térreo e Recepção', 2),
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Escadas e Rotas de Fuga', 3),
  ('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Cobertura', 4),
  ('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Anexo Caixa Cultural', 5)
ON CONFLICT DO NOTHING;

-- Itens do checklist - Base de Comando
INSERT INTO checklist_itens (id, categoria_id, descricao, ordem) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Verificar rádio comunicador', 1),
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Confirmar funcionamento do telefone de emergência', 2),
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Verificar livro de ocorrências', 3),
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'Confirmar acesso às chaves de emergência', 4)
ON CONFLICT DO NOTHING;

-- Itens - Térreo e Recepção
INSERT INTO checklist_itens (id, categoria_id, descricao, ordem) VALUES
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000002', 'Verificar saídas de emergência', 1),
  ('e1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000002', 'Confirmar sinalização visível', 2),
  ('e1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000002', 'Verificar iluminação de emergência', 3),
  ('e1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000002', 'Avaliar circulação de pessoas', 4)
ON CONFLICT DO NOTHING;

-- Itens - Escadas e Rotas de Fuga
INSERT INTO checklist_itens (id, categoria_id, descricao, ordem) VALUES
  ('e1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000003', 'Confirmar ausência de objetos bloqueando a passagem', 1),
  ('e1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000003', 'Verificar portas corta-fogo', 2),
  ('e1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000003', 'Confirmar sinalização das rotas', 3),
  ('e1000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000003', 'Avaliar iluminação', 4)
ON CONFLICT DO NOTHING;

-- Itens - Cobertura
INSERT INTO checklist_itens (id, categoria_id, descricao, ordem) VALUES
  ('e1000000-0000-0000-0000-000000000013', 'd1000000-0000-0000-0000-000000000004', 'Verificar acesso', 1),
  ('e1000000-0000-0000-0000-000000000014', 'd1000000-0000-0000-0000-000000000004', 'Avaliar condições da área técnica', 2),
  ('e1000000-0000-0000-0000-000000000015', 'd1000000-0000-0000-0000-000000000004', 'Verificar equipamentos instalados', 3),
  ('e1000000-0000-0000-0000-000000000016', 'd1000000-0000-0000-0000-000000000004', 'Registrar possíveis riscos', 4)
ON CONFLICT DO NOTHING;

-- Itens - Anexo Caixa Cultural
INSERT INTO checklist_itens (id, categoria_id, descricao, ordem) VALUES
  ('e1000000-0000-0000-0000-000000000017', 'd1000000-0000-0000-0000-000000000005', 'Verificar área do teatro', 1),
  ('e1000000-0000-0000-0000-000000000018', 'd1000000-0000-0000-0000-000000000005', 'Avaliar circulação de público', 2),
  ('e1000000-0000-0000-0000-000000000019', 'd1000000-0000-0000-0000-000000000005', 'Confirmar saídas de emergência', 3),
  ('e1000000-0000-0000-0000-000000000020', 'd1000000-0000-0000-0000-000000000005', 'Conferir equipamentos de combate a incêndio', 4),
  ('e1000000-0000-0000-0000-000000000021', 'd1000000-0000-0000-0000-000000000005', 'Registrar observações relevantes', 5)
ON CONFLICT DO NOTHING;

-- Equipamentos
INSERT INTO equipamentos (id, setor_id, codigo, tipo, classe, localizacao, data_instalacao, data_vencimento, status) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 'EXT-001', 'Extintor de água pressurizada', 'A', 'Térreo - Recepção', '2024-01-15', '2026-12-15', 'regular'),
  ('f1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'EXT-018', 'Extintor de CO₂', 'B e C', 'Cobertura - Área Técnica', '2023-06-10', '2026-06-10', 'proximo_vencimento'),
  ('f1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000004', 'EXT-024', 'Extintor de pó químico seco', 'ABC', 'Anexo Caixa Cultural - Teatro', '2023-05-20', '2026-05-20', 'vencido'),
  ('f1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'HID-001', 'Hidrante', NULL, 'Térreo - Hall principal', '2022-03-01', '2027-03-01', 'regular'),
  ('f1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000006', 'PCF-001', 'Porta corta-fogo', NULL, 'Escada principal - 1º andar', '2021-08-15', '2027-08-15', 'regular'),
  ('f1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005', 'ILE-001', 'Iluminação de emergência', NULL, 'Térreo - Corredor principal', '2023-11-01', '2026-11-01', 'regular'),
  ('f1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000007', 'DET-001', 'Detector de fumaça', NULL, 'Subsolo - Área técnica', '2024-02-20', '2027-02-20', 'regular'),
  ('f1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000008', 'ALR-001', 'Alarme', NULL, 'Estacionamento - Entrada', '2023-09-10', '2026-09-10', 'regular')
ON CONFLICT DO NOTHING;

-- Rondas de hoje
INSERT INTO rondas (id, nome, checklist_id, data_programada, horario_programado, status) VALUES
  ('a7000000-0000-0000-0000-000000000001', 'Ronda das 09h30', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE, '09:30', 'concluida'),
  ('a7000000-0000-0000-0000-000000000002', 'Ronda das 14h30', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE, '14:30', 'pendente'),
  ('a7000000-0000-0000-0000-000000000003', 'Ronda das 16h30', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE, '16:30', 'pendente')
ON CONFLICT DO NOTHING;

-- Ocorrências
INSERT INTO ocorrencias (id, numero, tipo, setor_id, criticidade, status, descricao, data_hora_abertura) VALUES
  ('a8000000-0000-0000-0000-000000000001', 'OC-2026-001', 'Equipamento próximo do vencimento', 'a1000000-0000-0000-0000-000000000003', 'media', 'em_acompanhamento', 'Extintor EXT-018 na cobertura está com vencimento próximo. Necessário agendar recarga.', '2026-05-28 10:30:00'),
  ('a8000000-0000-0000-0000-000000000002', 'OC-2026-002', 'Rota de fuga parcialmente obstruída', 'a1000000-0000-0000-0000-000000000004', 'alta', 'pendente', 'Materiais de cenografia parcialmente obstruindo saída de emergência lateral do teatro.', '2026-05-29 14:15:00')
ON CONFLICT DO NOTHING;

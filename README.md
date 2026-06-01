# Brigada360

**Gestão Inteligente de Segurança Predial**

Sistema web para gestão operacional de bombeiros civis e brigadistas em edifícios corporativos.

## Tecnologias

- React + Vite + TypeScript
- Netlify Functions (serverless API)
- Netlify Database (PostgreSQL)
- Lucide Icons
- bcryptjs + jsonwebtoken (autenticação)

## 1. Instalar dependências

```bash
npm install
```

## 2. Executar localmente (modo desenvolvimento)

```bash
npm run dev
```

O servidor Vite iniciará em `http://localhost:5173` com uma API mock embutida (dados em memória). Ideal para desenvolvimento e testes.

### Com Netlify CLI (banco PostgreSQL real)

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify dev
```

## 3. Habilitar Netlify Database

1. Acesse o painel da Netlify > seu site > **Database**
2. Habilite o Netlify Database (PostgreSQL)
3. O banco será provisionado automaticamente

## 4. Executar migrations

```bash
netlify database migrate
```

Arquivos de migration em `netlify/database/migrations/`:
- `001_initial_schema.sql` — tabelas principais
- `002_indexes.sql` — índices de performance
- `003_seed_data.sql` — dados iniciais

## 5. Executar seed

Os dados de demonstração são inseridos pela migration `003_seed_data.sql`.

Para o modo desenvolvimento local (`npm run dev`), os dados já estão incluídos automaticamente na API mock.

## 6. Variáveis de ambiente

Para produção, configure no painel da Netlify:

| Variável | Descrição |
|----------|-----------|
| `JWT_SECRET` | Chave secreta para tokens JWT |

O Netlify Database configura automaticamente a conexão com o PostgreSQL.

## 7. Testar Netlify Functions localmente

```bash
netlify dev
```

As functions ficam disponíveis em `http://localhost:8888/.netlify/functions/`.

## 8. Publicar

```bash
netlify deploy --prod
```

Ou configure deploy automático via Git no painel da Netlify.

## 9. Restaurar dados de demonstração

No painel administrativo:
1. Acesse **Configurações**
2. Clique em **Restaurar dados de demonstração**
3. Confirme a ação

## 10. Acessos iniciais

| Usuário | Senha | Perfil |
|---------|-------|--------|
| `admin` | `admin` | Administrador |
| `lider` | `lider` | Líder |
| `bombeiro` | `bombeiro` | Bombeiro Civil |
| `brigadista` | `brigadista` | Brigadista |
| `socorrista` | `socorrista` | Socorrista |

A tela de login possui botões de acesso rápido para cada perfil.

## 11. Estrutura do projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas (admin/ e app/)
├── layouts/        # Layouts (AdminLayout, OperationalLayout)
├── services/       # Cliente API
├── hooks/          # Hooks (useAuth)
├── types/          # Tipos TypeScript
├── styles/         # CSS global
└── dev-server.ts   # API mock para desenvolvimento

netlify/
├── functions/      # Netlify Functions (API)
└── database/
    └── migrations/ # SQL migrations
```

## 12. Perfis de acesso

- **ADMIN**: Painel administrativo completo (sidebar lateral)
- **LIDER / BOMBEIRO / BRIGADISTA / SOCORRISTA**: Área operacional mobile-first (menu inferior)

## 13. Funcionalidades do MVP (Etapa 1)

- Login com autenticação JWT
- Dashboard com indicadores
- CRUD de usuários, setores, postos, equipamentos
- Cadastro de checklists com categorias e itens
- Cadastro e execução de rondas
- Preenchimento de checklist com barra de progresso
- Registro de inspeções de equipamentos
- Registro e consulta de ocorrências
- Histórico de rondas e inspeções
- Auditoria de operações
- Restauração de dados demo
- Layout responsivo (mobile-first)
- Módulos futuros com tarja "EM EVOLUÇÃO"

## 14. Etapa 2 — Comunicação e Automação

Funcionalidades visíveis com tarja **EM EVOLUÇÃO**:
- Chat interno, QR Code, notificações, escala 12x36, fotos, assinatura digital

## 15. Etapa 3 — Inteligência Predial

Funcionalidades visíveis com tarja **EM EVOLUÇÃO**:
- Cartilha digital, inteligência predial, relatórios avançados, múltiplos edifícios

Consulte `ROADMAP_DATABASE.md` para tabelas planejadas.

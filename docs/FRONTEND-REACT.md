 SIGEA - Documentação do Frontend React

 Visão Geral

O frontend do SIGEA é uma aplicação React moderna e responsiva, projetada para oferecer uma interface intuitiva para gestão educacional. Suporta três perfis de usuário: administrador, professor e aluno, cada um com funcionalidades específicas.

 Arquitetura

```
sigea-frontend/
├── src/
│   ├── components/            Componentes React reutilizáveis
│   │   ├── Layout.jsx        Layout principal
│   │   └── Header.jsx        Cabeçalho da aplicação
│   ├── contexts/             Contextos React
│   │   └── AuthContext.jsx   Contexto de autenticação
│   ├── pages/                Páginas da aplicação
│   │   ├── LoginPage.jsx     Página de login
│   │   ├── AdminPage.jsx     Dashboard administrativo
│   │   ├── ProfessorPage.jsx  Dashboard do professor
│   │   └── AlunoPage.jsx     Dashboard do aluno
│   ├── services/             Serviços de integração
│   │   ├── api.js           Cliente da API REST
│   │   └── mockData.js      Dados simulados (fallback)
│   ├── utils/                Utilitários
│   │   └── calculations.js   Cálculos de médias e frequência
│   ├── App.jsx              Componente raiz
│   └── main.jsx             Ponto de entrada
├── public/                   Arquivos estáticos
└── package.json             Dependências e scripts
```

 Interface de Usuário

 Design System
- Cores: Paleta azul profissional (2c3e50, 3498db)
- Tipografia: Fontes system (Arial, sans-serif)
- Espaçamento: Grid consistente (8px, 16px, 24px)
- Componentes: Cards, botões, formulários padronizados

 Responsividade
- Desktop: Layout de 3 colunas (>1200px)
- Tablet: Layout de 2 colunas (768px-1199px)  
- Mobile: Layout de coluna única (<768px)

 Perfis de Usuário

 Administrador
Funcionalidades:
- Dashboard com estatísticas gerais
- Gestão completa de usuários (CRUD)
- Gerenciamento de professores e turmas
- Administração de alunos e matrículas
- Relatórios e analytics

Telas Principais:
- Visão geral do sistema
- Lista de usuários com ações
- Formulários de criação/edição
- Relatórios de desempenho

 Professor
Funcionalidades:
- Dashboard com turmas atribuídas
- Lançamento e edição de notas
- Registro de chamadas/frequência
- Visualização de desempenho dos alunos
- Relatórios de turma

Telas Principais:
- Minhas turmas
- Sistema de notas por aluno
- Controle de presença
- Estatísticas da turma

 Aluno
Funcionalidades:
- Visualização de notas por disciplina
- Consulta de frequência/faltas
- Informações da turma
- Histórico acadêmico

Telas Principais:
- Boletim de notas
- Registro de presença
- Informações pessoais

 Funcionalidades Técnicas

 Autenticação
- Sistema híbrido: API + Mock data
- JWT token storage no localStorage
- Auto-logout por expiração
- Proteção de rotas por perfil

 Estado Global
- Context API do React
- Gerenciamento de usuário logado
- Estado de loading/erro
- Dados compartilhados entre componentes

 Integração com API
- Cliente HTTP com fetch API
- Fallback automático para mock data
- Tratamento de erros gracioso
- Loading states consistentes

 Componentes Principais

 AuthContext
```javascript
// Contexto de autenticação com API híbrida
const AuthContext = createContext();

// Funcionalidades:
- login(email, password)
- logout()  
- getUserData()
- isAuthenticated
- userRole
```

 Layout Component
- Header responsivo
- Menu de navegação por perfil
- Sistema de logout
- Design consistente

 Dashboard Components
- Cards de estatísticas
- Tabelas interativas
- Formulários de CRUD
- Gráficos de desempenho

 Responsividade

 Breakpoints
```css
/ Mobile First /
@media (min-width: 768px) { / Tablet / }
@media (min-width: 1200px) { / Desktop / }
```

 Adaptações Mobile
- Menu hamburger
- Cards em stack vertical
- Tabelas com scroll horizontal
- Botões touch-friendly

 Adaptações Tablet
- Layout de 2 colunas
- Cards em grid 2x2
- Navegação por tabs
- Formulários otimizados

 Performance

 Otimizações
- Lazy loading de componentes
- Memoização com React.memo
- Debounce em busca/filtros
- Otimização de re-renders

 Bundle Size
- Vite para build otimizado
- Tree shaking automático
- CSS minificado
- Assets otimizados

 Dados de Teste

 Usuários Disponíveis
```javascript
// Admin
{ email: "admin@sigea.com", password: "admin123" }

// Professor  
{ email: "marcos.silva@sigea.com", password: "prof123" }

// Alunos
{ email: "ana.costa@sigea.com", password: "aluno123" }
{ email: "lucas.oliveira@sigea.com", password: "lucas123" }
```

 Mock Data
- 4 usuários de teste
- 3 turmas ativas
- 6 notas por aluno
- 16 registros de presença
- Dados realistas para demonstração

 Tecnologias

- React 18 - Framework UI moderno
- Vite - Build tool e dev server  
- CSS3 - Estilização responsiva
- Context API - Gerenciamento de estado
- Fetch API - Comunicação HTTP
- LocalStorage - Persistência local

 Scripts Disponíveis

```bash
 Desenvolvimento
npm run dev           Servidor de desenvolvimento

 Build
npm run build         Build para produção
npm run preview       Preview do build

 Qualidade
npm run lint          Linting do código
npm test              Executar testes
```

 Funcionalidades Futuras

 Planejadas
- PWA (Progressive Web App)
- Notificações push
- Chat entre professor/aluno
- Sistema de mensagens
- Exportação de relatórios PDF
- Integração com calendário

 Melhorias UX
- Tema escuro/claro
- Customização de dashboard
- Shortcuts de teclado
- Arrastar e soltar
- Busca avançada com filtros

 Troubleshooting

 Problemas Comuns
1. API não conecta: Verificar se backend está rodando
2. Login não funciona: Conferir credenciais de teste
3. Dados não carregam: Verificar console do navegador
4. Layout quebrado: Limpar cache do navegador

 Debug Mode
```javascript
// Ativar logs detalhados
localStorage.setItem('debug', 'true');
```

 Logs Úteis
- Network tab (DevTools) para requisições
- Console para erros JavaScript  
- Application tab para localStorage


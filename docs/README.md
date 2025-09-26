 SIGEA - Sistema Integrado de Gestão Educacional e Acadêmica

 Visão Geral

O SIGEA é um sistema web completo para gestão educacional, desenvolvido com React no frontend e Node.js/Express no backend, utilizando MySQL como banco de dados. O sistema oferece funcionalidades abrangentes para administração acadêmica, incluindo gestão de usuários, turmas, notas e chamadas.

 Arquitetura

```
sigea/
├── docs/                        Documentação completa
│   ├── BACKEND-API.md          Documentação da API
│   ├── FRONTEND-REACT.md       Documentação do Frontend
│   └── REORGANIZACAO.md        Guia de organização
├── database/                   Banco de dados
│   ├── schema.sql             Estrutura das tabelas
│   ├── database_seed.sql      Dados de exemplo
│   └── MODELAGEM-BD.md        Documentação do BD
├── frontend/                  Aplicação React
│   ├── src/
│   │   ├── components/       Componentes React
│   │   ├── contexts/         Contextos (AuthContext)
│   │   ├── services/         API e Mock services
│   │   └── utils/           Utilitários
│   └── package.json
├── backend/                   API Node.js/Express
│   ├── config/               Configurações do banco
│   ├── middleware/           Middleware de segurança
│   ├── routes/              Rotas da API
│   ├── server.js            Servidor principal
│   └── package.json
├── install.ps1               Script instalação Windows
└── install.sh                Script instalação Linux/Mac
```

 Tecnologias

 Frontend
- React 18 - Framework UI moderno
- Vite - Build tool e dev server
- CSS3 - Estilização responsiva
- Fetch API - Comunicação com backend

 Backend
- Node.js - Runtime JavaScript
- Express.js - Framework web
- MySQL2 - Driver MySQL
- JWT - Autenticação stateless
- bcryptjs - Hash de senhas
- Helmet - Security middleware

 Banco de Dados
- MySQL - Sistema de gerenciamento de BD relacional

 Instalação Rápida

 Windows (PowerShell)
```powershell
 Execute o script de instalação automática
.\install.ps1
```

 Manual
```bash
 1. Backend
cd backend
npm install
cp .env.example .env   Configure suas credenciais MySQL

 2. Frontend
cd ../frontend
npm install
```

 Configuração

 1. MySQL
Execute os scripts SQL na ordem:
1. Schema da Tarefa 3 (estrutura das tabelas)
2. `database_seed.sql` (dados de exemplo)

 2. Arquivo .env (backend/.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sigeas_db
JWT_SECRET=seu_jwt_secret_super_seguro
PORT=5000
```

 Execução

 Desenvolvimento
```bash
 Terminal 1 - Backend
cd backend
npm run dev           http://localhost:5000

 Terminal 2 - Frontend  
cd frontend
npm run dev           http://localhost:5173
```

 Produção
```bash
 Backend
cd backend
npm start

 Frontend (build)
cd frontend
npm run build
npm run preview
```

 Credenciais de Teste

| Perfil | Email | Senha | Permissões |
|--------|-------|-------|------------|
| Admin | admin@sigea.com | admin123 | Completas |
| Professor | marcos.silva@sigea.com | prof123 | Turmas, Notas, Chamadas |
| Aluno | ana.costa@sigea.com | aluno123 | Visualização |
| Aluno | lucas.oliveira@sigea.com | lucas123 | Visualização |

 Funcionalidades

 Painel Administrativo
- Gestão de usuários (CRUD completo)
- Gestão de professores
- Gestão de turmas
- Gestão de alunos e matrículas
- Relatórios e estatísticas

 Painel do Professor
- Visualização de turmas atribuídas
- Lançamento de notas
- Registro de chamadas
- Relatórios de desempenho

 Painel do Aluno
- Visualização de notas
- Histórico de frequência
- Consulta de turmas

 API Endpoints

 Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário

 Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Excluir usuário

 Turmas
- `GET /api/turmas` - Listar turmas
- `POST /api/turmas` - Criar turma
- `PUT /api/turmas/:id` - Atualizar turma
- `DELETE /api/turmas/:id` - Excluir turma

 Professores
- `GET /api/professores` - Listar professores
- `GET /api/professores/:id/turmas` - Turmas do professor

 Alunos
- `GET /api/alunos` - Listar alunos
- `POST /api/alunos` - Criar aluno
- `POST /api/alunos/matricular` - Matricular aluno

 Notas
- `GET /api/notas/turma/:turmaId` - Notas da turma
- `POST /api/notas` - Lançar nota
- `PUT /api/notas/:id` - Atualizar nota

 Chamadas
- `GET /api/chamadas/turma/:turmaId` - Chamadas da turma
- `POST /api/chamadas` - Registrar chamada

 Segurança

- JWT Authentication - Tokens seguros para autenticação
- Bcrypt - Hash seguro de senhas
- Helmet - Cabeçalhos de segurança HTTP
- CORS - Configuração adequada de CORS
- Rate Limiting - Proteção contra ataques
- Input Validation - Validação de entrada
- SQL Injection Prevention - Proteção contra SQL injection

 Responsividade

O sistema é totalmente responsivo, funcionando em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

 Testes

 Frontend
```bash
cd frontend
npm test
```

 Backend
```bash
cd backend
npm test
```

 Build para Produção

 Frontend
```bash
cd frontend
npm run build
```

 Backend
O backend está pronto para produção com:
- Variáveis de ambiente
- Middleware de segurança
- Tratamento de erros
- Logs estruturados

 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

 Documentação

- [Documentação Completa](docs/) - Pasta com toda documentação
- [Backend API](docs/BACKEND-API.md) - Documentação da API REST
- [Frontend React](docs/FRONTEND-REACT.md) - Documentação do React
- [Modelagem BD](database/MODELAGEM-BD.md) - Modelagem do banco
- [Reorganização](docs/REORGANIZACAO.md) - Guia de organização

 Suporte

Para reportar bugs ou solicitar funcionalidades:
1. Verifique se já existe uma issue similar
2. Crie uma nova issue com detalhes
3. Inclua steps para reproduzir (se bug)

 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

---

Desenvolvido para gestão educacional moderna


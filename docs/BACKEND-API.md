 SIGEA - Documentação do Backend API

 Visão Geral

Esta documentação apresenta o backend completo do Sistema de Gestão de Aulas (SIGEA), desenvolvido em Node.js com Express, MySQL e autenticação JWT. A API RESTful implementa todas as funcionalidades necessárias para suportar o frontend e gerenciar as regras de negócio.

 Arquitetura

```
sigea-backend/
├── server.js               Servidor principal
├── config/
│   └── database.js         Configuração MySQL
├── middleware/
│   ├── auth.js            Middleware de autenticação
│   ├── cors.js            Configuração CORS
│   └── security.js        Middleware de segurança
├── routes/
│   ├── auth.js            Rotas de autenticação
│   ├── usuarios.js        CRUD usuários
│   ├── turmas.js          CRUD turmas
│   ├── professores.js     Endpoints professores
│   ├── alunos.js          CRUD alunos
│   ├── notas.js           CRUD notas
│   └── chamadas.js        CRUD chamadas
└── package.json           Dependências
```

 API Endpoints

 Autenticação (/api/auth)
- `POST /login` - Login de usuário
- `POST /register` - Registro (admin apenas)  
- `GET /me` - Dados do usuário logado
- `POST /logout` - Logout

 Usuários (/api/usuarios)
- `GET /` - Listar usuários (admin)
- `GET /:id` - Buscar usuário específico
- `PUT /:id` - Atualizar usuário
- `DELETE /:id` - Remover usuário (admin)

 Turmas (/api/turmas)
- `GET /` - Listar turmas
- `GET /:id` - Buscar turma específica
- `POST /` - Criar turma (admin)
- `PUT /:id` - Atualizar turma (admin)
- `DELETE /:id` - Remover turma (admin)

 Professores (/api/professores)
- `GET /` - Listar professores
- `GET /:id` - Buscar professor específico
- `GET /:id/turmas` - Turmas do professor

 Alunos (/api/alunos)
- `GET /` - Listar alunos
- `GET /:id` - Buscar aluno específico
- `POST /` - Criar aluno (admin)
- `POST /matricular` - Matricular aluno

 Notas (/api/notas)
- `GET /` - Listar notas (com filtros)
- `GET /turma/:turmaId` - Notas da turma
- `GET /aluno/:alunoId` - Notas do aluno
- `POST /` - Criar nota (professor/admin)
- `PUT /:id` - Atualizar nota (professor/admin)
- `DELETE /:id` - Remover nota (professor/admin)

 Chamadas (/api/chamadas)
- `GET /` - Listar chamadas (com filtros)
- `GET /turma/:turmaId` - Chamadas da turma
- `POST /` - Criar chamada (professor/admin)
- `PUT /:id` - Atualizar chamada (professor/admin)

 Segurança

 Autenticação JWT
- Tokens seguros com expiração
- Middleware de verificação
- Hash de senhas com bcrypt

 Middleware de Segurança
- Helmet para cabeçalhos HTTP
- CORS configurado adequadamente
- Rate limiting anti-spam
- Validação de entrada

 Autorização por Perfil
- Admin: Acesso completo
- Professor: Gerenciar suas turmas, notas e chamadas
- Aluno: Visualização apenas de seus dados

 Instalação e Execução

 Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- NPM ou Yarn

 Configuração
1. Instalar dependências:
   ```bash
   npm install
   ```

2. Configurar .env:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_NAME=sigeas_db
   JWT_SECRET=seu_jwt_secret
   PORT=5000
   ```

3. Criar banco de dados:
   ```bash
    Execute database/schema.sql
    Execute database/database_seed.sql
   ```

 Executar
```bash
 Desenvolvimento
npm run dev

 Produção  
npm start
```

 Regras de Negócio

 Usuários
- Email único no sistema
- Perfis: admin, professor, aluno
- Senhas criptografadas

 Professores
- Vinculados a usuários
- Podem ter múltiplas turmas
- Gerenciam notas e chamadas

 Alunos
- Vinculados a usuários e turmas
- Podem ter histórico de matrículas
- Recebem notas e têm presença registrada

 Turmas
- Gerenciadas por professores
- Têm alunos matriculados
- Registram chamadas e notas

 Notas
- Valores entre 0.0 e 10.0
- Vinculadas a alunos e disciplinas
- Registram data da avaliação

 Chamadas
- Uma por turma por data
- Lista de alunos presentes (JSON)
- Histórico completo de presença

 Testes

 Credenciais de Teste
- Admin: admin@sigea.com / admin123
- Professor: marcos.silva@sigea.com / prof123
- Aluno: ana.costa@sigea.com / aluno123

 Endpoints para Teste
```bash
 Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sigea.com","password":"admin123"}'

 Listar turmas (com token)
curl -X GET http://localhost:5000/api/turmas \
  -H "Authorization: Bearer seu_token_jwt"
```

 Tecnologias

- Node.js - Runtime JavaScript
- Express.js - Framework web
- MySQL2 - Driver MySQL
- JWT - Autenticação
- bcryptjs - Hash de senhas
- Helmet - Segurança HTTP
- CORS - Cross-origin requests

 Performance

- Conexões de banco otimizadas
- Índices em campos de busca
- Middleware de cache (futuro)
- Compressão de resposta

 Logs e Monitoramento

- Logs estruturados no console
- Tratamento de erros padronizado
- Status codes HTTP apropriados
- Validação de entrada robusta


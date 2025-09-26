 TAREFA 3: Modelagem do Banco de Dados - SIGEA

 Visão Geral

Esta documentação apresenta a estrutura de banco de dados do Sistema de Gestão de Aulas (SIGEA), projetada para suportar as funcionalidades do frontend desenvolvido na Tarefa 2.

 Diagrama Entidade-Relacionamento (DER)

```
┌─────────────┐    1:1    ┌─────────────┐    1:N    ┌─────────────┐
│   Usuarios  │◄─────────►│ Professores │◄─────────►│   Turmas    │
│             │           │             │           │             │
│ id (PK)     │           │ id (PK)     │           │ id (PK)     │
│ nome        │           │ nome        │           │ nome        │
│ email       │           │ departamento│           │ ano         │
│ senha       │           │ usuario_id  │           │ professor_id│
│ perfil      │           │  (FK)       │           │  (FK)       │
└─────────────┘           └─────────────┘           └─────────────┘
       ▲                                                   ▲
       │1:1                                                │1:N
       ▼                                                   ▼
┌─────────────┐    N:M    ┌─────────────┐    1:N    ┌─────────────┐
│   Alunos    │◄─────────►│ Matriculas  │           │  Chamadas   │
│             │           │             │           │             │
│ id (PK)     │           │ id (PK)     │           │ id (PK)     │
│ nome        │           │ aluno_id    │           │ turma_id    │
│ data_nasc   │           │  (FK)       │           │  (FK)       │
│ turma_id    │           │ turma_id    │           │ data        │
│  (FK)       │           │  (FK)       │           │ presentes   │
│ usuario_id  │           │ data_matric │           │             │
│  (FK)       │           │             │           └─────────────┘
└─────────────┘           └─────────────┘
       │                                 
       │1:N                             
       ▼                               
┌─────────────┐                       
│   Notas     │                       
│             │                       
│ id (PK)     │                       
│ aluno_id    │                       
│  (FK)       │                       
│ disciplina  │                       
│ valor       │                       
│ data        │                       
└─────────────┘                       
```

 Script SQL de Criação

```sql
-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS sigeas_db;
USE sigeas_db;

-- Tabela principal de usuários do sistema
CREATE TABLE Usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL
);

-- Tabela de professores (extensão de Usuarios)
CREATE TABLE Professores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    departamento VARCHAR(255),
    usuario_id INT UNIQUE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

-- Tabela de turmas vinculadas a professores
CREATE TABLE Turmas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    ano INT NOT NULL,
    professor_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES Professores(id)
);

-- Tabela de alunos (extensão de Usuarios)
CREATE TABLE Alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    turma_id INT NOT NULL,
    usuario_id INT UNIQUE NOT NULL,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

-- Tabela de matrículas (relacionamento N:M entre Alunos e Turmas)
CREATE TABLE Matriculas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_matricula DATE NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES Alunos(id),
    FOREIGN KEY (turma_id) REFERENCES Turmas(id)
);

-- Tabela de chamadas por turma e data
CREATE TABLE Chamadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    turma_id INT NOT NULL,
    data DATE NOT NULL,
    presentes TEXT, -- JSON ou CSV com IDs dos alunos presentes
    FOREIGN KEY (turma_id) REFERENCES Turmas(id)
);

-- Tabela de notas dos alunos
CREATE TABLE Notas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    disciplina VARCHAR(255) NOT NULL,
    valor FLOAT NOT NULL,
    data DATE NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES Alunos(id)
);
```

 Detalhamento das Entidades

 1. Usuarios
Propósito: Tabela central para autenticação e autorização no sistema.

| Campo  | Tipo         | Restrições        | Descrição                    |
|--------|--------------|-------------------|------------------------------|
| id     | INT          | PRIMARY KEY, AUTO | Identificador único          |
| nome   | VARCHAR(255) | NOT NULL          | Nome completo do usuário     |
| email  | VARCHAR(255) | UNIQUE, NOT NULL  | Email para login             |
| senha  | VARCHAR(255) | NOT NULL          | Hash da senha                |
| perfil | VARCHAR(50)  | NOT NULL          | admin, professor, aluno      |

 2. Professores
Propósito: Dados específicos dos professores, estendendo Usuarios.

| Campo       | Tipo         | Restrições     | Descrição                    |
|-------------|--------------|----------------|------------------------------|
| id          | INT          | PRIMARY KEY    | Identificador único          |
| nome        | VARCHAR(255) | NOT NULL       | Nome do professor            |
| departamento| VARCHAR(255) | NULLABLE       | Departamento/Área            |
| usuario_id  | INT          | FK UNIQUE      | Referência a Usuarios        |

 3. Turmas
Propósito: Classes gerenciadas pelos professores.

| Campo       | Tipo         | Restrições     | Descrição                    |
|-------------|--------------|----------------|------------------------------|
| id          | INT          | PRIMARY KEY    | Identificador único          |
| nome        | VARCHAR(255) | NOT NULL       | Nome da turma                |
| ano         | INT          | NOT NULL       | Ano letivo                   |
| professor_id| INT          | FK NOT NULL    | Professor responsável        |

 4. Alunos
Propósito: Dados dos estudantes, estendendo Usuarios.

| Campo           | Tipo         | Restrições     | Descrição                    |
|-----------------|--------------|----------------|------------------------------|
| id              | INT          | PRIMARY KEY    | Identificador único          |
| nome            | VARCHAR(255) | NOT NULL       | Nome do aluno                |
| data_nascimento | DATE         | NULLABLE       | Data de nascimento           |
| turma_id        | INT          | FK NOT NULL    | Turma atual                  |
| usuario_id      | INT          | FK UNIQUE      | Referência a Usuarios        |

 5. Matriculas
Propósito: Histórico de matrículas (relacionamento N:M entre Alunos e Turmas).

| Campo         | Tipo | Restrições  | Descrição                    |
|---------------|------|-------------|------------------------------|
| id            | INT  | PRIMARY KEY | Identificador único          |
| aluno_id      | INT  | FK NOT NULL | Aluno matriculado            |
| turma_id      | INT  | FK NOT NULL | Turma da matrícula           |
| data_matricula| DATE | NOT NULL    | Data da matrícula            |

 6. Chamadas
Propósito: Registro de presença por turma e data.

| Campo     | Tipo | Restrições  | Descrição                      |
|-----------|------|-------------|--------------------------------|
| id        | INT  | PRIMARY KEY | Identificador único            |
| turma_id  | INT  | FK NOT NULL | Turma da chamada               |
| data      | DATE | NOT NULL    | Data da aula                   |
| presentes | TEXT | NULLABLE    | IDs dos alunos presentes (JSON)|

 7. Notas
Propósito: Avaliações e notas dos alunos.

| Campo      | Tipo         | Restrições  | Descrição                    |
|------------|--------------|-------------|------------------------------|
| id         | INT          | PRIMARY KEY | Identificador único          |
| aluno_id   | INT          | FK NOT NULL | Aluno avaliado               |
| disciplina | VARCHAR(255) | NOT NULL    | Matéria/Disciplina           |
| valor      | FLOAT        | NOT NULL    | Nota (0.0 a 10.0)            |
| data       | DATE         | NOT NULL    | Data da avaliação            |

 Relacionamentos

 1:1 (Um para Um)
- Usuarios ↔ Professores: Um usuário pode ser um professor
- Usuarios ↔ Alunos: Um usuário pode ser um aluno

 1:N (Um para Muitos)
- Professores → Turmas: Um professor pode ter várias turmas
- Turmas → Alunos: Uma turma pode ter vários alunos
- Turmas → Chamadas: Uma turma pode ter várias chamadas
- Alunos → Notas: Um aluno pode ter várias notas

 N:M (Muitos para Muitos)
- Alunos ↔ Turmas: Através da tabela Matriculas (histórico)

 Integração com o Frontend

 Mapeamento dos Mock Data
Os dados simulados no frontend correspondem às seguintes tabelas:

javascript
// mockData.ts → Tabelas SQL
mockUsuarios    → Usuarios
mockProfessores → Professores + Usuarios
mockAlunos      → Alunos + Usuarios  
mockTurmas      → Turmas
mockPresencas   → Chamadas
mockNotas       → Notas
```

 Queries Típicas do Sistema

Login de usuário:
```sql
SELECT u.id, u.nome, u.perfil 
FROM Usuarios u 
WHERE u.email = ? AND u.senha = ?;
```

Dashboard do Professor:
```sql
SELECT t. 
FROM Turmas t 
JOIN Professores p ON t.professor_id = p.id 
WHERE p.usuario_id = ?;
```

Notas do Aluno:
```sql
SELECT n.disciplina, n.valor, n.data 
FROM Notas n 
JOIN Alunos a ON n.aluno_id = a.id 
WHERE a.usuario_id = ?;
```

Chamada da Turma:
```sql
SELECT c.data, c.presentes 
FROM Chamadas c 
WHERE c.turma_id = ? 
ORDER BY c.data DESC;
```

Considerações de Design

 Pontos Fortes
- Normalização adequada: Evita redundância de dados
- Flexibilidade: Suporta histórico de matrículas
- Extensibilidade: Fácil adição de novos perfis de usuário
- Integridade referencial: FKs garantem consistência

 Melhorias Sugeridas
1. Índices: Adicionar índices em campos de busca frequente
2. Auditoria: Campos created_at, updated_at
3. Soft Delete: Campo deleted_at para exclusão lógica
4. Validações: Constraints para perfis válidos
5. Campo presentes: Normalizar em tabela separada

 Schema Melhorado (Opcional)
```sql
-- Tabela normalizada para presenças
CREATE TABLE Presencas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chamada_id INT NOT NULL,
    aluno_id INT NOT NULL,
    presente BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (chamada_id) REFERENCES Chamadas(id),
    FOREIGN KEY (aluno_id) REFERENCES Alunos(id),
    UNIQUE KEY unique_presence (chamada_id, aluno_id)
);
```


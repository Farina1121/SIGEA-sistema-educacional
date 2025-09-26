-- Script de criação do banco de dados SIGEA
-- Execute este arquivo: mysql -u root -p < setup_database.sql

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS sigeas_db;
USE sigeas_db;

-- Tabela principal de usuários do sistema
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('admin', 'professor', 'aluno') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de professores (extensão de Usuarios)
CREATE TABLE IF NOT EXISTS Professores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    departamento VARCHAR(255),
    usuario_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de turmas vinculadas a professores
CREATE TABLE IF NOT EXISTS Turmas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    ano INT NOT NULL,
    professor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES Professores(id) ON DELETE CASCADE
);

-- Tabela de alunos (extensão de Usuarios)
CREATE TABLE IF NOT EXISTS Alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    turma_id INT NOT NULL,
    usuario_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de matrículas (relacionamento N:M entre Alunos e Turmas)
CREATE TABLE IF NOT EXISTS Matriculas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_matricula DATE NOT NULL DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES Alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_matricula (aluno_id, turma_id)
);

-- Tabela de chamadas por turma e data
CREATE TABLE IF NOT EXISTS Chamadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    turma_id INT NOT NULL,
    data DATE NOT NULL,
    presentes JSON, -- JSON com IDs dos alunos presentes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_chamada (turma_id, data)
);

-- Tabela de notas dos alunos
CREATE TABLE IF NOT EXISTS Notas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    disciplina VARCHAR(255) NOT NULL,
    valor DECIMAL(4,2) NOT NULL CHECK (valor >= 0.00 AND valor <= 10.00),
    data DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES Alunos(id) ON DELETE CASCADE
);

-- Inserir dados iniciais
-- Usuários básicos
INSERT INTO Usuarios (nome, email, senha, perfil) VALUES
('Administrador', 'admin@sigea.com', '$2a$12$K8Y5rAKzJr5v3l7MsWx8E.QhPvV1r8k4RzBcJ6y9z5XqF4J1P7h2e', 'admin'),
('Marcos Silva', 'marcos.silva@sigea.com', '$2a$12$K8Y5rAKzJr5v3l7MsWx8E.QhPvV1r8k4RzBcJ6y9z5XqF4J1P7h2e', 'professor'),
('Ana Costa', 'ana.costa@sigea.com', '$2a$12$K8Y5rAKzJr5v3l7MsWx8E.QhPvV1r8k4RzBcJ6y9z5XqF4J1P7h2e', 'aluno'),
('Lucas Oliveira', 'lucas.oliveira@sigea.com', '$2a$12$K8Y5rAKzJr5v3l7MsWx8E.QhPvV1r8k4RzBcJ6y9z5XqF4J1P7h2e', 'aluno')
ON DUPLICATE KEY UPDATE nome=VALUES(nome);

-- Professor
INSERT INTO Professores (nome, departamento, usuario_id) VALUES
('Marcos Silva', 'Ciências Exatas', 2)
ON DUPLICATE KEY UPDATE nome=VALUES(nome);

-- Turmas
INSERT INTO Turmas (nome, ano, professor_id) VALUES
('Matemática - 3º Ano', 2025, 1),
('Português - 2º Ano', 2025, 1),
('História - 1º Ano', 2025, 1)
ON DUPLICATE KEY UPDATE nome=VALUES(nome);

-- Alunos
INSERT INTO Alunos (nome, data_nascimento, turma_id, usuario_id) VALUES
('Ana Costa', '2005-03-15', 1, 3),
('Lucas Oliveira', '2005-07-22', 1, 4)
ON DUPLICATE KEY UPDATE nome=VALUES(nome);

-- Matrículas
INSERT INTO Matriculas (aluno_id, turma_id, data_matricula) VALUES
(1, 1, '2025-01-15'),
(2, 1, '2025-01-15')
ON DUPLICATE KEY UPDATE data_matricula=VALUES(data_matricula);

-- Notas de exemplo
INSERT INTO Notas (aluno_id, disciplina, valor, data) VALUES
(1, 'Matemática', 8.50, '2025-09-15'),
(1, 'Português', 7.20, '2025-09-16'),
(2, 'Matemática', 9.00, '2025-09-15'),
(2, 'Português', 6.80, '2025-09-16')
ON DUPLICATE KEY UPDATE valor=VALUES(valor);

-- Chamadas de exemplo
INSERT INTO Chamadas (turma_id, data, presentes) VALUES
(1, '2025-09-20', JSON_ARRAY(1, 2)),
(1, '2025-09-21', JSON_ARRAY(1)),
(2, '2025-09-20', JSON_ARRAY(1, 2))
ON DUPLICATE KEY UPDATE presentes=VALUES(presentes);

-- Verificar criação
SELECT 'Banco de dados criado com sucesso!' as status;
SELECT COUNT(*) as total_usuarios FROM Usuarios;
SELECT COUNT(*) as total_turmas FROM Turmas;
SELECT COUNT(*) as total_notas FROM Notas;
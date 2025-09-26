-- SIGEA - Script de Criação da Estrutura do Banco de Dados
-- Execute este script ANTES do database_seed.sql

-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS sigeas_db;
USE sigeas_db;

-- Remover tabelas existentes (se houver) na ordem correta
DROP TABLE IF EXISTS Notas;
DROP TABLE IF EXISTS Chamadas;
DROP TABLE IF EXISTS Matriculas;
DROP TABLE IF EXISTS Alunos;
DROP TABLE IF EXISTS Turmas;
DROP TABLE IF EXISTS Professores;
DROP TABLE IF EXISTS Usuarios;

-- Tabela principal de usuários do sistema
CREATE TABLE Usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de professores (extensão de Usuarios)
CREATE TABLE Professores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    departamento VARCHAR(255),
    usuario_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de turmas vinculadas a professores
CREATE TABLE Turmas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    ano INT NOT NULL,
    professor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES Professores(id) ON DELETE CASCADE
);

-- Tabela de alunos (extensão de Usuarios)
CREATE TABLE Alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    turma_id INT NOT NULL,
    usuario_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de matrículas (relacionamento N:M entre Alunos e Turmas)
CREATE TABLE Matriculas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_matricula DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES Alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_matricula (aluno_id, turma_id)
);

-- Tabela de chamadas por turma e data
CREATE TABLE Chamadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    turma_id INT NOT NULL,
    data DATE NOT NULL,
    presentes TEXT, -- JSON com IDs dos alunos presentes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_chamada (turma_id, data)
);

-- Tabela de notas dos alunos
CREATE TABLE Notas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    disciplina VARCHAR(255) NOT NULL,
    valor FLOAT NOT NULL CHECK (valor >= 0 AND valor <= 10),
    data DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES Alunos(id) ON DELETE CASCADE
);

-- Criar índices para melhor performance
CREATE INDEX idx_usuarios_email ON Usuarios(email);
CREATE INDEX idx_usuarios_perfil ON Usuarios(perfil);
CREATE INDEX idx_professores_usuario ON Professores(usuario_id);
CREATE INDEX idx_turmas_professor ON Turmas(professor_id);
CREATE INDEX idx_alunos_turma ON Alunos(turma_id);
CREATE INDEX idx_alunos_usuario ON Alunos(usuario_id);
CREATE INDEX idx_matriculas_aluno ON Matriculas(aluno_id);
CREATE INDEX idx_matriculas_turma ON Matriculas(turma_id);
CREATE INDEX idx_chamadas_turma ON Chamadas(turma_id);
CREATE INDEX idx_chamadas_data ON Chamadas(data);
CREATE INDEX idx_notas_aluno ON Notas(aluno_id);
CREATE INDEX idx_notas_data ON Notas(data);

-- Verificar estrutura criada
SHOW TABLES;

SELECT 'Estrutura do banco criada com sucesso!' as Status;
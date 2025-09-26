-- SIGEA - Sistema de Gestão Escolar
-- Script de Criação do Banco de Dados e Tabelas
-- Execute este script ANTES do seed

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS sigeas_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sigeas_db;

-- Tabela de Usuários (base para todos os perfis)
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('admin', 'professor', 'aluno') NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS Professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    departamento VARCHAR(100),
    telefone VARCHAR(20),
    usuario_id INT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS Turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ano YEAR NOT NULL,
    periodo ENUM('manhã', 'tarde', 'noite') DEFAULT 'manhã',
    professor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES Professores(id) ON DELETE SET NULL
);

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS Alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    telefone VARCHAR(20),
    turma_id INT,
    usuario_id INT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de Matrículas (histórico de matrículas)
CREATE TABLE IF NOT EXISTS Matriculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_matricula DATE NOT NULL,
    status ENUM('ativa', 'transferido', 'concluida') DEFAULT 'ativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES Alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE CASCADE
);

-- Tabela de Chamadas
CREATE TABLE IF NOT EXISTS Chamadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    data DATE NOT NULL,
    presentes JSON, -- Array de IDs dos alunos presentes
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES Turmas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_turma_data (turma_id, data)
);

-- Tabela de Notas
CREATE TABLE IF NOT EXISTS Notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    disciplina VARCHAR(100) NOT NULL,
    valor DECIMAL(4,2) NOT NULL,
    data DATE NOT NULL,
    tipo ENUM('prova', 'trabalho', 'participacao', 'projeto') DEFAULT 'prova',
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES Alunos(id) ON DELETE CASCADE,
    CHECK (valor >= 0 AND valor <= 10)
);

-- Índices para performance
CREATE INDEX idx_usuarios_email ON Usuarios(email);
CREATE INDEX idx_usuarios_perfil ON Usuarios(perfil);
CREATE INDEX idx_alunos_turma ON Alunos(turma_id);
CREATE INDEX idx_professores_usuario ON Professores(usuario_id);
CREATE INDEX idx_chamadas_turma_data ON Chamadas(turma_id, data);
CREATE INDEX idx_notas_aluno ON Notas(aluno_id);
CREATE INDEX idx_notas_data ON Notas(data);

-- Exibir estrutura criada
SHOW TABLES;

SELECT 'Estrutura do banco de dados criada com sucesso!' as Status;
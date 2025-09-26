-- SIGEA - Script de Inicialização do Banco de Dados
-- Execute este script após criar as tabelas da Tarefa 3

USE sigeas_db;

-- Limpar dados existentes (se houver)
DELETE FROM Notas;
DELETE FROM Chamadas;
DELETE FROM Matriculas;
DELETE FROM Alunos;
DELETE FROM Turmas;
DELETE FROM Professores;
DELETE FROM Usuarios;

-- Reset AUTO_INCREMENT
ALTER TABLE Usuarios AUTO_INCREMENT = 1;
ALTER TABLE Professores AUTO_INCREMENT = 1;
ALTER TABLE Turmas AUTO_INCREMENT = 1;
ALTER TABLE Alunos AUTO_INCREMENT = 1;
ALTER TABLE Matriculas AUTO_INCREMENT = 1;
ALTER TABLE Chamadas AUTO_INCREMENT = 1;
ALTER TABLE Notas AUTO_INCREMENT = 1;

-- Inserir Usuários (senhas hashadas para 'admin123', 'prof123', 'aluno123', 'lucas123')
INSERT INTO Usuarios (nome, email, senha, perfil) VALUES 
-- Senha: admin123 (hash bcrypt)
('Cláudia Ferreira', 'admin@sigea.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewyrNmkoDf7OM.Bu', 'admin'),
-- Senha: prof123
('Marcos Silva', 'marcos.silva@sigea.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professor'),
-- Senha: aluno123
('Ana Costa', 'ana.costa@sigea.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aluno'),
-- Senha: lucas123
('Lucas Oliveira', 'lucas.oliveira@sigea.com', '$2a$12$WzVkmd8QGa8pKz8P5.vf8OGjLt5h8Sn0lZOzRl5xKz8P5.vf8OGj', 'aluno');

-- Inserir Professores
INSERT INTO Professores (nome, departamento, usuario_id) VALUES 
('Marcos Silva', 'Matemática', 2);

-- Inserir Turmas
INSERT INTO Turmas (nome, ano, professor_id) VALUES 
('3º Ano A - Matemática', 2025, 1),
('2º Ano B - Matemática', 2025, 1),
('1º Ano C - Matemática', 2025, 1);

-- Inserir Alunos
INSERT INTO Alunos (nome, data_nascimento, turma_id, usuario_id) VALUES 
('Ana Costa', '2007-03-15', 1, 3),
('Lucas Oliveira', '2008-07-22', 1, 4);

-- Inserir Matrículas
INSERT INTO Matriculas (aluno_id, turma_id, data_matricula) VALUES 
(1, 1, '2025-01-15'),
(2, 1, '2025-01-15');

-- Inserir Notas (simulando sistema de avaliação)
INSERT INTO Notas (aluno_id, disciplina, valor, data) VALUES 
-- Ana Costa (boa aluna)
(1, 'Matemática - Prova 1', 8.5, '2025-03-15'),
(1, 'Matemática - Prova 2', 9.0, '2025-06-20'),
(1, 'Matemática - Trabalho', 8.8, '2025-05-10'),
-- Lucas Oliveira (precisa de apoio)
(2, 'Matemática - Prova 1', 5.5, '2025-03-15'),
(2, 'Matemática - Prova 2', 4.8, '2025-06-20'),
(2, 'Matemática - Trabalho', 6.2, '2025-05-10');

-- Inserir Chamadas (últimos 30 dias simulados)
INSERT INTO Chamadas (turma_id, data, presentes) VALUES 
-- Setembro 2025 (Ana presente, Lucas com algumas faltas)
(1, '2025-09-01', '[1, 2]'),
(1, '2025-09-02', '[1]'),      -- Lucas faltou
(1, '2025-09-03', '[1, 2]'),
(1, '2025-09-04', '[1, 2]'),
(1, '2025-09-05', '[1, 2]'),
(1, '2025-09-08', '[1]'),      -- Lucas faltou
(1, '2025-09-09', '[1, 2]'),
(1, '2025-09-10', '[1, 2]'),
(1, '2025-09-11', '[1, 2]'),
(1, '2025-09-12', '[1, 2]'),
(1, '2025-09-15', '[1, 2]'),
(1, '2025-09-16', '[1]'),      -- Lucas faltou
(1, '2025-09-17', '[1, 2]'),
(1, '2025-09-18', '[1, 2]'),
(1, '2025-09-19', '[1, 2]'),
(1, '2025-09-22', '[1, 2]');

-- Verificar dados inseridos
SELECT 'USUÁRIOS:' as Tabela;
SELECT id, nome, email, perfil FROM Usuarios;

SELECT 'PROFESSORES:' as Tabela;
SELECT p.id, p.nome, p.departamento, u.email 
FROM Professores p 
LEFT JOIN Usuarios u ON p.usuario_id = u.id;

SELECT 'TURMAS:' as Tabela;
SELECT t.id, t.nome, t.ano, p.nome as professor 
FROM Turmas t 
LEFT JOIN Professores p ON t.professor_id = p.id;

SELECT 'ALUNOS:' as Tabela;
SELECT a.id, a.nome, t.nome as turma, u.email 
FROM Alunos a 
LEFT JOIN Turmas t ON a.turma_id = t.id 
LEFT JOIN Usuarios u ON a.usuario_id = u.id;

SELECT 'NOTAS:' as Tabela;
SELECT n.id, a.nome as aluno, n.disciplina, n.valor, n.data 
FROM Notas n 
LEFT JOIN Alunos a ON n.aluno_id = a.id 
ORDER BY a.nome, n.data;

SELECT 'CHAMADAS (últimas 5):' as Tabela;
SELECT c.id, t.nome as turma, c.data, c.presentes 
FROM Chamadas c 
LEFT JOIN Turmas t ON c.turma_id = t.id 
ORDER BY c.data DESC 
LIMIT 5;

-- Estatísticas rápidas
SELECT 'ESTATÍSTICAS:' as Info;
SELECT 
  (SELECT COUNT(*) FROM Usuarios) as total_usuarios,
  (SELECT COUNT(*) FROM Turmas) as total_turmas,
  (SELECT COUNT(*) FROM Alunos) as total_alunos,
  (SELECT COUNT(*) FROM Notas) as total_notas,
  (SELECT COUNT(*) FROM Chamadas) as total_chamadas;

COMMIT;
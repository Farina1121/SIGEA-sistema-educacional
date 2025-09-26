const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);


router.get('/', async (req, res) => {
  try {
    const { alunoId, disciplina } = req.query;
    
    let query = `
      SELECT 
        n.id, n.valor, n.disciplina, n.data,
        a.id as aluno_id, a.nome as aluno_nome,
        t.nome as turma_nome
      FROM Notas n
      LEFT JOIN Alunos a ON n.aluno_id = a.id
      LEFT JOIN Turmas t ON a.turma_id = t.id
    `;
    
    let params = [];
    let conditions = [];


    if (alunoId) {
      conditions.push('n.aluno_id = ?');
      params.push(alunoId);
    }


    if (disciplina) {
      conditions.push('n.disciplina = ?');
      params.push(disciplina);
    }


    if (req.user.perfil === 'professor') {
      query += ` LEFT JOIN Professores p ON t.professor_id = p.id`;
      conditions.push('p.usuario_id = ?');
      params.push(req.user.id);
    }


    if (req.user.perfil === 'aluno') {
      conditions.push('a.usuario_id = ?');
      params.push(req.user.id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY n.data DESC, a.nome';

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({ error: 'Erro ao buscar notas', message: result.error });
    }

    res.json({ notas: result.data, total: result.data.length });
  } catch (error) {
    console.error('Erro ao listar notas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


router.post('/', authorizeRoles('admin', 'professor'), async (req, res) => {
  try {
    const { alunoId, disciplina, valor, data } = req.body;

    if (!alunoId || !disciplina || valor === undefined || !data) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Aluno, disciplina, valor e data são obrigatórios'
      });
    }

    if (valor < 0 || valor > 10) {
      return res.status(400).json({
        error: 'Valor inválido',
        message: 'A nota deve estar entre 0 e 10'
      });
    }


    const alunoCheck = await executeQuery('SELECT id FROM Alunos WHERE id = ?', [alunoId]);
    if (!alunoCheck.success || alunoCheck.data.length === 0) {
      return res.status(400).json({ error: 'Aluno não encontrado' });
    }

    const result = await executeQuery(
      'INSERT INTO Notas (aluno_id, disciplina, valor, data) VALUES (?, ?, ?, ?)',
      [alunoId, disciplina, valor, data]
    );

    if (!result.success) {
      return res.status(400).json({ error: 'Erro ao criar nota', message: result.error });
    }

    res.status(201).json({
      message: 'Nota criada com sucesso',
      nota: { id: result.data.insertId, alunoId, disciplina, valor, data }
    });

  } catch (error) {
    console.error('Erro ao criar nota:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


router.put('/:id', authorizeRoles('admin', 'professor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, disciplina, data } = req.body;

    if (valor === undefined || !disciplina || !data) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Valor, disciplina e data são obrigatórios'
      });
    }

    if (valor < 0 || valor > 10) {
      return res.status(400).json({
        error: 'Valor inválido',
        message: 'A nota deve estar entre 0 e 10'
      });
    }

    const result = await executeQuery(
      'UPDATE Notas SET valor = ?, disciplina = ?, data = ? WHERE id = ?',
      [valor, disciplina, data, id]
    );

    if (!result.success) {
      return res.status(400).json({ error: 'Erro ao atualizar nota', message: result.error });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }

    res.json({ message: 'Nota atualizada com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


router.delete('/:id', authorizeRoles('admin', 'professor'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM Notas WHERE id = ?', [id]);

    if (!result.success) {
      return res.status(400).json({ error: 'Erro ao remover nota', message: result.error });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }

    res.json({ message: 'Nota removida com sucesso' });

  } catch (error) {
    console.error('Erro ao remover nota:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

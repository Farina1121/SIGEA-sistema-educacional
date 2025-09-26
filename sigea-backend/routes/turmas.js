const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


router.use(authenticateToken);


router.get('/', async (req, res) => {
  try {
    let query = `
      SELECT 
        t.id, t.nome, t.ano,
        p.id as professor_id, p.nome as professor_nome,
        COUNT(a.id) as total_alunos
      FROM Turmas t
      LEFT JOIN Professores p ON t.professor_id = p.id
      LEFT JOIN Alunos a ON t.id = a.turma_id
    `;

    let params = [];


    if (req.user.perfil === 'professor') {
      query += ' WHERE p.usuario_id = ?';
      params.push(req.user.id);
    }

    query += ' GROUP BY t.id, t.nome, t.ano, p.id, p.nome ORDER BY t.nome';

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({
        error: 'Erro ao buscar turmas',
        message: result.error
      });
    }

    res.json({
      turmas: result.data,
      total: result.data.length
    });

  } catch (error) {
    console.error('Erro ao listar turmas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(`
      SELECT 
        t.id, t.nome, t.ano,
        p.id as professor_id, p.nome as professor_nome,
        p.departamento
      FROM Turmas t
      LEFT JOIN Professores p ON t.professor_id = p.id
      WHERE t.id = ?
    `, [id]);

    if (!result.success) {
      return res.status(500).json({
        error: 'Erro ao buscar turma',
        message: result.error
      });
    }

    if (result.data.length === 0) {
      return res.status(404).json({
        error: 'Turma não encontrada'
      });
    }

    const turma = result.data[0];


    const alunosResult = await executeQuery(`
      SELECT 
        a.id, a.nome, a.data_nascimento,
        u.email
      FROM Alunos a
      LEFT JOIN Usuarios u ON a.usuario_id = u.id
      WHERE a.turma_id = ?
      ORDER BY a.nome
    `, [id]);

    res.json({
      turma: {
        ...turma,
        alunos: alunosResult.success ? alunosResult.data : []
      }
    });

  } catch (error) {
    console.error('Erro ao buscar turma:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});


router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const { nome, ano, professorId } = req.body;

    if (!nome || !ano || !professorId) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome, ano e professor são obrigatórios'
      });
    }


    const profCheck = await executeQuery(
      'SELECT id FROM Professores WHERE id = ?',
      [professorId]
    );

    if (!profCheck.success || profCheck.data.length === 0) {
      return res.status(400).json({
        error: 'Professor não encontrado'
      });
    }

    const result = await executeQuery(
      'INSERT INTO Turmas (nome, ano, professor_id) VALUES (?, ?, ?)',
      [nome, ano, professorId]
    );

    if (!result.success) {
      return res.status(400).json({
        error: 'Erro ao criar turma',
        message: result.error
      });
    }

    res.status(201).json({
      message: 'Turma criada com sucesso',
      turma: {
        id: result.data.insertId,
        nome,
        ano,
        professor_id: professorId
      }
    });

  } catch (error) {
    console.error('Erro ao criar turma:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});


router.put('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, ano, professorId } = req.body;

    if (!nome || !ano || !professorId) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome, ano e professor são obrigatórios'
      });
    }


    const profCheck = await executeQuery(
      'SELECT id FROM Professores WHERE id = ?',
      [professorId]
    );

    if (!profCheck.success || profCheck.data.length === 0) {
      return res.status(400).json({
        error: 'Professor não encontrado'
      });
    }

    const result = await executeQuery(
      'UPDATE Turmas SET nome = ?, ano = ?, professor_id = ? WHERE id = ?',
      [nome, ano, professorId, id]
    );

    if (!result.success) {
      return res.status(400).json({
        error: 'Erro ao atualizar turma',
        message: result.error
      });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({
        error: 'Turma não encontrada'
      });
    }

    res.json({
      message: 'Turma atualizada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar turma:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});


router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;


    const alunosCheck = await executeQuery(
      'SELECT COUNT(*) as total FROM Alunos WHERE turma_id = ?',
      [id]
    );

    if (alunosCheck.success && alunosCheck.data[0].total > 0) {
      return res.status(400).json({
        error: 'Turma possui alunos',
        message: 'Não é possível excluir uma turma que possui alunos matriculados'
      });
    }

    const result = await executeQuery(
      'DELETE FROM Turmas WHERE id = ?',
      [id]
    );

    if (!result.success) {
      return res.status(400).json({
        error: 'Erro ao remover turma',
        message: result.error
      });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({
        error: 'Turma não encontrada'
      });
    }

    res.json({
      message: 'Turma removida com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover turma:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

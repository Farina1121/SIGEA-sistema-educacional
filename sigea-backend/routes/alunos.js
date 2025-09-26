const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);


router.get('/', async (req, res) => {
  try {
    let query = `
      SELECT 
        a.id, a.nome, a.data_nascimento,
        t.id as turma_id, t.nome as turma_nome,
        u.email
      FROM Alunos a
      LEFT JOIN Turmas t ON a.turma_id = t.id
      LEFT JOIN Usuarios u ON a.usuario_id = u.id
    `;
    
    let params = [];
    

    if (req.user.perfil === 'professor') {
      query += ` 
        LEFT JOIN Professores p ON t.professor_id = p.id
        WHERE p.usuario_id = ?
      `;
      params.push(req.user.id);
    }
    
    query += ' ORDER BY a.nome';

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({ error: 'Erro ao buscar alunos', message: result.error });
    }

    res.json({ alunos: result.data, total: result.data.length });
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        a.id, a.nome, a.data_nascimento,
        t.id as turma_id, t.nome as turma_nome,
        u.email
      FROM Alunos a
      LEFT JOIN Turmas t ON a.turma_id = t.id
      LEFT JOIN Usuarios u ON a.usuario_id = u.id
      WHERE a.id = ?
    `, [req.params.id]);

    if (!result.success || result.data.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json({ aluno: result.data[0] });
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);


router.get('/', authorizeRoles('admin', 'professor'), async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        p.id, p.nome, p.departamento,
        u.email,
        COUNT(t.id) as total_turmas
      FROM Professores p
      LEFT JOIN Usuarios u ON p.usuario_id = u.id
      LEFT JOIN Turmas t ON p.id = t.professor_id
      GROUP BY p.id, p.nome, p.departamento, u.email
      ORDER BY p.nome
    `);

    if (!result.success) {
      return res.status(500).json({ error: 'Erro ao buscar professores', message: result.error });
    }

    res.json({ professores: result.data, total: result.data.length });
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        p.id, p.nome, p.departamento,
        u.email
      FROM Professores p
      LEFT JOIN Usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!result.success || result.data.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    res.json({ professor: result.data[0] });
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

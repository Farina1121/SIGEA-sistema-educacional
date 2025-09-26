const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);


router.get('/', async (req, res) => {
  try {
    const { turmaId, data } = req.query;
    
    let query = `
      SELECT 
        c.id, c.data, c.presentes,
        t.id as turma_id, t.nome as turma_nome
      FROM Chamadas c
      LEFT JOIN Turmas t ON c.turma_id = t.id
    `;
    
    let params = [];
    let conditions = [];


    if (turmaId) {
      conditions.push('c.turma_id = ?');
      params.push(turmaId);
    }


    if (data) {
      conditions.push('c.data = ?');
      params.push(data);
    }


    if (req.user.perfil === 'professor') {
      query += ` LEFT JOIN Professores p ON t.professor_id = p.id`;
      conditions.push('p.usuario_id = ?');
      params.push(req.user.id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.data DESC';

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({ error: 'Erro ao buscar chamadas', message: result.error });
    }


    const chamadas = result.data.map(chamada => ({
      ...chamada,
      presentes: chamada.presentes ? JSON.parse(chamada.presentes) : []
    }));

    res.json({ chamadas, total: chamadas.length });
  } catch (error) {
    console.error('Erro ao listar chamadas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


router.post('/', authorizeRoles('admin', 'professor'), async (req, res) => {
  try {
    const { turmaId, data, presentes } = req.body;

    if (!turmaId || !data) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Turma e data são obrigatórios'
      });
    }


    const turmaCheck = await executeQuery('SELECT id FROM Turmas WHERE id = ?', [turmaId]);
    if (!turmaCheck.success || turmaCheck.data.length === 0) {
      return res.status(400).json({ error: 'Turma não encontrada' });
    }


    const existeCheck = await executeQuery(
      'SELECT id FROM Chamadas WHERE turma_id = ? AND data = ?',
      [turmaId, data]
    );

    if (existeCheck.success && existeCheck.data.length > 0) {
      return res.status(400).json({
        error: 'Chamada já existe',
        message: 'Já existe uma chamada para esta turma nesta data'
      });
    }


    const presentesJson = presentes ? JSON.stringify(presentes) : '[]';

    const result = await executeQuery(
      'INSERT INTO Chamadas (turma_id, data, presentes) VALUES (?, ?, ?)',
      [turmaId, data, presentesJson]
    );

    if (!result.success) {
      return res.status(400).json({ error: 'Erro ao criar chamada', message: result.error });
    }

    res.status(201).json({
      message: 'Chamada criada com sucesso',
      chamada: { id: result.data.insertId, turmaId, data, presentes: presentes || [] }
    });

  } catch (error) {
    console.error('Erro ao criar chamada:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


router.put('/:id', authorizeRoles('admin', 'professor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { presentes } = req.body;

    if (!presentes || !Array.isArray(presentes)) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Lista de presentes é obrigatória e deve ser um array'
      });
    }


    const presentesJson = JSON.stringify(presentes);

    const result = await executeQuery(
      'UPDATE Chamadas SET presentes = ? WHERE id = ?',
      [presentesJson, id]
    );

    if (!result.success) {
      return res.status(400).json({ error: 'Erro ao atualizar chamada', message: result.error });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ error: 'Chamada não encontrada' });
    }

    res.json({ message: 'Chamada atualizada com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar chamada:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


router.get('/presenca/:alunoId', async (req, res) => {
  try {
    const { alunoId } = req.params;


    const alunoResult = await executeQuery(`
      SELECT a.id, a.nome, a.turma_id, t.nome as turma_nome 
      FROM Alunos a 
      LEFT JOIN Turmas t ON a.turma_id = t.id 
      WHERE a.id = ?
    `, [alunoId]);

    if (!alunoResult.success || alunoResult.data.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const aluno = alunoResult.data[0];


    const chamadasResult = await executeQuery(`
      SELECT id, data, presentes 
      FROM Chamadas 
      WHERE turma_id = ? 
      ORDER BY data DESC
    `, [aluno.turma_id]);

    if (!chamadasResult.success) {
      return res.status(500).json({ error: 'Erro ao buscar presenças', message: chamadasResult.error });
    }


    const presencas = chamadasResult.data.map(chamada => {
      const presentes = chamada.presentes ? JSON.parse(chamada.presentes) : [];
      return {
        id: chamada.id,
        data: chamada.data,
        presente: presentes.includes(parseInt(alunoId))
      };
    });

    res.json({ 
      aluno: aluno,
      presencas: presencas,
      total: presencas.length,
      totalPresentes: presencas.filter(p => p.presente).length
    });

  } catch (error) {
    console.error('Erro ao buscar presenças do aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

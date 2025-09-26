const express = require('express');
const { executeQuery, mockDatabase, mysqlAvailable } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


router.use(authenticateToken);


router.get('/', authorizeRoles('admin'), async (req, res) => {
  try {
    let result;
    
    if (!mysqlAvailable) {
      result = await mockDatabase.getAllUsers();
    } else {
      result = await executeQuery(
        'SELECT id, nome, email, perfil, created_at FROM Usuarios ORDER BY nome'
      );
    }

    if (!result.success) {
      return res.status(500).json({
        error: 'Erro ao buscar usuários',
        message: result.error
      });
    }

    res.json({
      usuarios: result.data,
      total: result.data.length,
      source: mysqlAvailable ? 'mysql' : 'mock'
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    

    if (req.user.perfil !== 'admin' && req.user.id != id) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você só pode acessar seus próprios dados'
      });
    }

    const result = await executeQuery(
      'SELECT id, nome, email, perfil FROM Usuarios WHERE id = ?',
      [id]
    );

    if (!result.success) {
      return res.status(500).json({
        error: 'Erro ao buscar usuário',
        message: result.error
      });
    }

    if (result.data.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      usuario: result.data[0]
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email } = req.body;


    if (req.user.perfil !== 'admin' && req.user.id != id) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você só pode editar seus próprios dados'
      });
    }

    if (!nome || !email) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome e email são obrigatórios'
      });
    }

    let result;
    
    if (!mysqlAvailable) {
      result = await mockDatabase.updateUser(id, { nome, email });
    } else {
      result = await executeQuery(
        'UPDATE Usuarios SET nome = ?, email = ? WHERE id = ?',
        [nome, email, id]
      );
    }

    if (!result.success) {
      return res.status(400).json({
        error: 'Erro ao atualizar usuário',
        message: result.error
      });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      message: 'Usuário atualizado com sucesso',
      source: mysqlAvailable ? 'mysql' : 'mock'
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});


router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const { nome, email, perfil, senha } = req.body;

    if (!nome || !email || !perfil || !senha) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome, email, perfil e senha são obrigatórios'
      });
    }


    let checkResult;
    
    if (!mysqlAvailable) {
      checkResult = await mockDatabase.findUserByEmail(email);
    } else {
      checkResult = await executeQuery(
        'SELECT id FROM Usuarios WHERE email = ?',
        [email]
      );
    }

    if (checkResult.success && checkResult.data.length > 0) {
      return res.status(400).json({
        error: 'Email já existe',
        message: 'Este email já está cadastrado no sistema'
      });
    }


    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(senha, 12);

    let result;
    
    if (!mysqlAvailable) {
      result = await mockDatabase.createUser({
        nome,
        email,
        senha: hashedPassword,
        perfil
      });
    } else {
      result = await executeQuery(
        'INSERT INTO Usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
        [nome, email, hashedPassword, perfil]
      );
    }

    if (!result.success) {
      return res.status(400).json({
        error: 'Erro ao criar usuário',
        message: result.error
      });
    }

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      id: result.data.insertId,
      source: mysqlAvailable ? 'mysql' : 'mock'
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});


router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;


    if (req.user.id == id) {
      return res.status(400).json({
        error: 'Operação não permitida',
        message: 'Você não pode deletar sua própria conta'
      });
    }

    let result;
    
    if (!mysqlAvailable) {
      result = await mockDatabase.deleteUser(id);
    } else {
      result = await executeQuery(
        'DELETE FROM Usuarios WHERE id = ?',
        [id]
      );
    }

    if (!result.success) {
      return res.status(400).json({
        error: 'Erro ao remover usuário',
        message: result.error
      });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      message: 'Usuário removido com sucesso',
      source: mysqlAvailable ? 'mysql' : 'mock'
    });

  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

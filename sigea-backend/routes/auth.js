const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      perfil: user.perfil
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Email e senha são obrigatórios'
      });
    }


    const result = await executeQuery(
      'SELECT id, nome, email, senha, perfil FROM Usuarios WHERE email = ?',
      [email]
    );

    if (!result.success) {
      return res.status(500).json({
        error: 'Erro interno',
        message: 'Erro ao consultar usuário'
      });
    }

    const user = result.data[0];


    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }


    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (!senhaValida) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }


    const token = generateToken(user);


    let profileData = {};
    
    if (user.perfil === 'professor') {
      const profResult = await executeQuery(
        'SELECT id, departamento FROM Professores WHERE usuario_id = ?',
        [user.id]
      );
      profileData = profResult.success ? profResult.data[0] : {};
    } else if (user.perfil === 'aluno') {
      const alunoResult = await executeQuery(
        'SELECT id, turma_id, data_nascimento FROM Alunos WHERE usuario_id = ?',
        [user.id]
      );
      profileData = alunoResult.success ? alunoResult.data[0] : {};
    }


    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        ...profileData
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao processar login'
    });
  }
});


router.post('/register', authenticateToken, async (req, res) => {
  try {

    if (req.user.perfil !== 'admin') {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas administradores podem registrar novos usuários'
      });
    }

    const { nome, email, senha, perfil, dadosExtras } = req.body;


    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome, email, senha e perfil são obrigatórios'
      });
    }

    if (!['admin', 'professor', 'aluno'].includes(perfil)) {
      return res.status(400).json({
        error: 'Perfil inválido',
        message: 'Perfil deve ser admin, professor ou aluno'
      });
    }


    const senhaHash = await bcrypt.hash(senha, 12);


    const userResult = await executeQuery(
      'INSERT INTO Usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, perfil]
    );

    if (!userResult.success) {
      return res.status(400).json({
        error: 'Erro ao criar usuário',
        message: userResult.error
      });
    }

    const userId = userResult.data.insertId;


    if (perfil === 'professor' && dadosExtras) {
      await executeQuery(
        'INSERT INTO Professores (nome, departamento, usuario_id) VALUES (?, ?, ?)',
        [nome, dadosExtras.departamento || null, userId]
      );
    } else if (perfil === 'aluno' && dadosExtras) {
      await executeQuery(
        'INSERT INTO Alunos (nome, data_nascimento, turma_id, usuario_id) VALUES (?, ?, ?, ?)',
        [nome, dadosExtras.dataNascimento || null, dadosExtras.turmaId, userId]
      );
    }

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: userId,
        nome,
        email,
        perfil
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao criar usuário'
    });
  }
});


router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar dados do usuário'
    });
  }
});


router.post('/logout', authenticateToken, (req, res) => {

  res.json({
    message: 'Logout realizado com sucesso'
  });
});

module.exports = router;

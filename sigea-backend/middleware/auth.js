const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');


const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token de acesso requerido',
      message: 'Você precisa estar logado para acessar este recurso'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    const result = await executeQuery(
      'SELECT id, nome, email, perfil FROM Usuarios WHERE id = ? AND ativo = 1',
      [decoded.userId]
    );

    if (!result.success || result.data.length === 0) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Usuário não encontrado ou inativo'
      });
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      perfil: decoded.perfil,
      ...result.data[0]
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'Sua sessão expirou, faça login novamente'
      });
    }

    return res.status(403).json({
      error: 'Token inválido',
      message: 'Token de acesso inválido'
    });
  }
};


const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.perfil)) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: `Perfil '${req.user.perfil}' não tem permissão para acessar este recurso`
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};

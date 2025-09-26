const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');

const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const turmaRoutes = require('./routes/turmas');
const alunoRoutes = require('./routes/alunos');
const professorRoutes = require('./routes/professores');
const notaRoutes = require('./routes/notas');
const chamadaRoutes = require('./routes/chamadas');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
  }
});
app.use(limiter);


app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

testConnection();

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/notas', notaRoutes);
app.use('/api/chamadas', chamadaRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SIGEA API está funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      error: 'Dados duplicados',
      message: 'Este registro já existe no sistema'
    });
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'Referência inválida',
      message: 'Tentativa de referenciar um registro que não existe'
    });
  }
  
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe nesta API`
  });
});

app.listen(PORT, () => {
  console.log(`Servidor SIGEA rodando na porta ${PORT}`);
  console.log(` Ambiente: ${process.env.NODE_ENV}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});

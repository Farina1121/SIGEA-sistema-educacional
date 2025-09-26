const mysql = require('mysql2/promise');
const mockDatabase = require('../mock/mockDatabase');


const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sigeas_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};


let mysqlAvailable = false;


const pool = mysql.createPool(dbConfig);


const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MySQL - Database:', process.env.DB_NAME);
    connection.release();
    mysqlAvailable = true;
    return true;
  } catch (error) {
    console.warn('⚠️  MySQL não disponível, usando dados simulados:', error.message);
    mysqlAvailable = false;
    return false;
  }
};


const executeQuery = async (query, params = []) => {

  if (!mysqlAvailable) {
    console.log('🎭 [MOCK] Executando query simulada');
    return await mockDatabase.executeQuery(query, params);
  }

  try {
    const [results] = await pool.execute(query, params);
    return { success: true, data: results };
  } catch (error) {
    console.error('❌ Erro na query MySQL:', error.message);
    console.log('🎭 Fallback para dados simulados');
    mysqlAvailable = false;
    return await mockDatabase.executeQuery(query, params);
  }
};


const executeTransaction = async (queries) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params || []);
      results.push(result);
    }
    
    await connection.commit();
    return { success: true, data: results };
  } catch (error) {
    await connection.rollback();
    console.error('Erro na transação:', error);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  executeTransaction,
  mockDatabase,
  get mysqlAvailable() { return mysqlAvailable; }
};




let mockUsers = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@sigea.com',
    senha: '$2a$12$K8Y5rAKzJr5v3l7MsWx8E.QhPvV1r8k4RzBcJ6y9z5XqF4J1P7h2e',
    perfil: 'admin'
  },
  {
    id: 2,
    nome: 'Marcos Silva',
    email: 'marcos.silva@sigea.com',
    senha: '$2a$12$K8Y5rAKzJr5v3l7MsWx8E.QhPvV1r8k4RzBcJ6y9z5XqF4J1P7h2e',
    perfil: 'professor'
  },
  {
    id: 3,
    nome: 'Ana Costa',
    email: 'ana.costa@sigea.com',
    senha: '$2a$12$K8Y5rAKzJr5v3l7MsWx8E.QhPvV1r8k4RzBcJ6y9z5XqF4J1P7h2e',
    perfil: 'aluno'
  },
  {
    id: 4,
    nome: 'Lucas Oliveira',
    email: 'lucas.oliveira@sigea.com',
    senha: '$2a$12$K8Y5rAKzJr5v3l7MsWx8E.QhPvV1r8k4RzBcJ6y9z5XqF4J1P7h2e',
    perfil: 'aluno'
  }
];

let mockTurmas = [
  { id: 1, nome: 'Matemática - 3º Ano', ano: 2025, professor_id: 2 },
  { id: 2, nome: 'Português - 2º Ano', ano: 2025, professor_id: 2 },
  { id: 3, nome: 'História - 1º Ano', ano: 2025, professor_id: 2 }
];

let mockProfessores = [
  { id: 2, nome: 'Marcos Silva', departamento: 'Ciências Exatas', usuario_id: 2 }
];

let mockAlunos = [
  { id: 3, nome: 'Ana Costa', data_nascimento: '2005-03-15', turma_id: 1, usuario_id: 3 },
  { id: 4, nome: 'Lucas Oliveira', data_nascimento: '2005-07-22', turma_id: 1, usuario_id: 4 }
];

let mockNotas = [
  { id: 1, aluno_id: 3, disciplina: 'Matemática', valor: 8.5, data: '2025-09-15' },
  { id: 2, aluno_id: 3, disciplina: 'Português', valor: 7.2, data: '2025-09-16' },
  { id: 3, aluno_id: 4, disciplina: 'Matemática', valor: 9.0, data: '2025-09-15' },
  { id: 4, aluno_id: 4, disciplina: 'Português', valor: 6.8, data: '2025-09-16' }
];

let mockChamadas = [
  { id: 1, turma_id: 1, data: '2025-09-20', presentes: '[3,4]' },
  { id: 2, turma_id: 1, data: '2025-09-21', presentes: '[3]' },
  { id: 3, turma_id: 2, data: '2025-09-20', presentes: '[3,4]' }
];


let nextUserId = 5;
let nextTurmaId = 4;
let nextNotaId = 5;
let nextChamadaId = 4;


class MockDatabase {
  

  async findUserByEmail(email) {
    const user = mockUsers.find(u => u.email === email);
    return { success: true, data: user ? [user] : [] };
  }

  async findUserById(id) {
    const user = mockUsers.find(u => u.id == id);
    return { success: true, data: user ? [user] : [] };
  }

  async getAllUsers() {
    return { success: true, data: mockUsers };
  }

  async createUser(userData) {
    const newUser = {
      id: nextUserId++,
      ...userData
    };
    mockUsers.push(newUser);
    return { success: true, data: { insertId: newUser.id } };
  }

  async updateUser(id, userData) {
    const index = mockUsers.findIndex(u => u.id == id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...userData };
      return { success: true, data: { affectedRows: 1 } };
    }
    return { success: false, error: 'Usuário não encontrado' };
  }

  async deleteUser(id) {
    const index = mockUsers.findIndex(u => u.id == id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return { success: true, data: { affectedRows: 1 } };
    }
    return { success: false, error: 'Usuário não encontrado' };
  }


  async getAllTurmas() {
    return { success: true, data: mockTurmas };
  }

  async findTurmaById(id) {
    const turma = mockTurmas.find(t => t.id == id);
    return { success: true, data: turma ? [turma] : [] };
  }

  async createTurma(turmaData) {
    const newTurma = {
      id: nextTurmaId++,
      ...turmaData
    };
    mockTurmas.push(newTurma);
    return { success: true, data: { insertId: newTurma.id } };
  }

  async updateTurma(id, turmaData) {
    const index = mockTurmas.findIndex(t => t.id == id);
    if (index !== -1) {
      mockTurmas[index] = { ...mockTurmas[index], ...turmaData };
      return { success: true, data: { affectedRows: 1 } };
    }
    return { success: false, error: 'Turma não encontrada' };
  }

  async deleteTurma(id) {
    const index = mockTurmas.findIndex(t => t.id == id);
    if (index !== -1) {
      mockTurmas.splice(index, 1);
      return { success: true, data: { affectedRows: 1 } };
    }
    return { success: false, error: 'Turma não encontrada' };
  }


  async getAllProfessores() {
    return { success: true, data: mockProfessores };
  }

  async findProfessorById(id) {
    const professor = mockProfessores.find(p => p.id == id);
    return { success: true, data: professor ? [professor] : [] };
  }


  async getAllAlunos() {
    return { success: true, data: mockAlunos };
  }

  async findAlunoById(id) {
    const aluno = mockAlunos.find(a => a.id == id);
    return { success: true, data: aluno ? [aluno] : [] };
  }


  async getAllNotas() {
    return { success: true, data: mockNotas };
  }

  async findNotasByAluno(alunoId) {
    const notas = mockNotas.filter(n => n.aluno_id == alunoId);
    return { success: true, data: notas };
  }

  async createNota(notaData) {
    const newNota = {
      id: nextNotaId++,
      ...notaData
    };
    mockNotas.push(newNota);
    return { success: true, data: { insertId: newNota.id } };
  }

  async updateNota(id, notaData) {
    const index = mockNotas.findIndex(n => n.id == id);
    if (index !== -1) {
      mockNotas[index] = { ...mockNotas[index], ...notaData };
      return { success: true, data: { affectedRows: 1 } };
    }
    return { success: false, error: 'Nota não encontrada' };
  }

  async deleteNota(id) {
    const index = mockNotas.findIndex(n => n.id == id);
    if (index !== -1) {
      mockNotas.splice(index, 1);
      return { success: true, data: { affectedRows: 1 } };
    }
    return { success: false, error: 'Nota não encontrada' };
  }


  async getAllChamadas() {
    return { success: true, data: mockChamadas };
  }

  async findChamadasByTurma(turmaId) {
    const chamadas = mockChamadas.filter(c => c.turma_id == turmaId);
    return { success: true, data: chamadas };
  }

  async createChamada(chamadaData) {
    const newChamada = {
      id: nextChamadaId++,
      ...chamadaData
    };
    mockChamadas.push(newChamada);
    return { success: true, data: { insertId: newChamada.id } };
  }

  async updateChamada(id, chamadaData) {
    const index = mockChamadas.findIndex(c => c.id == id);
    if (index !== -1) {
      mockChamadas[index] = { ...mockChamadas[index], ...chamadaData };
      return { success: true, data: { affectedRows: 1 } };
    }
    return { success: false, error: 'Chamada não encontrada' };
  }


  async executeQuery(query, params = []) {
    console.log('[MOCK DB] Query simulada:', query);
    

    if (query.includes('SELECT') && query.includes('email')) {
      const email = params[0];
      return this.findUserByEmail(email);
    }
    
    if (query.includes('SELECT') && query.includes('Usuarios')) {
      return this.getAllUsers();
    }
    
    if (query.includes('SELECT') && query.includes('Turmas')) {
      return this.getAllTurmas();
    }
    
    if (query.includes('INSERT')) {
      return { success: true, data: { insertId: Date.now(), affectedRows: 1 } };
    }
    
    if (query.includes('UPDATE')) {
      return { success: true, data: { affectedRows: 1 } };
    }
    
    if (query.includes('DELETE')) {
      return { success: true, data: { affectedRows: 1 } };
    }
    
    return { success: true, data: [] };
  }
}

module.exports = new MockDatabase();




import { User, Turma, Professor, Aluno, Presenca, Nota, DashboardStats } from '../types';


export const mockUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    name: 'Cláudia Ferreira',
    role: 'admin',
    email: 'claudia.ferreira@escola.edu.br'
  },
  {
    id: 'prof-1',
    username: 'marcos.silva',
    name: 'Marcos Silva',
    role: 'professor',
    email: 'marcos.silva@escola.edu.br'
  },
  {
    id: 'prof-2',
    username: 'maria.santos',
    name: 'Maria Santos',
    role: 'professor',
    email: 'maria.santos@escola.edu.br'
  },
  {
    id: 'aluno-1',
    username: 'ana.costa',
    name: 'Ana Costa',
    role: 'aluno',
    email: 'ana.costa@email.com',
    turmaId: 'turma-1'
  },
  {
    id: 'aluno-2',
    username: 'lucas.oliveira',
    name: 'Lucas Oliveira',
    role: 'aluno',
    email: 'lucas.oliveira@email.com',
    turmaId: 'turma-1'
  },
  {
    id: 'aluno-3',
    username: 'carla.lima',
    name: 'Carla Lima',
    role: 'aluno',
    email: 'carla.lima@email.com',
    turmaId: 'turma-2'
  }
];

export const mockTurmas: Turma[] = [
  {
    id: 'turma-1',
    nome: '3º Ano A',
    ano: '2025',
    periodo: 'matutino',
    professorId: 'prof-1',
    professorNome: 'Marcos Silva',
    totalAlunos: 25,
    createdAt: new Date('2025-02-01')
  },
  {
    id: 'turma-2',
    nome: '2º Ano B',
    ano: '2025',
    periodo: 'vespertino',
    professorId: 'prof-2',
    professorNome: 'Maria Santos',
    totalAlunos: 28,
    createdAt: new Date('2025-02-01')
  },
  {
    id: 'turma-3',
    nome: '1º Ano C',
    ano: '2025',
    periodo: 'matutino',
    professorId: 'prof-1',
    professorNome: 'Marcos Silva',
    totalAlunos: 22,
    createdAt: new Date('2025-02-01')
  }
];

export const mockProfessores: Professor[] = [
  {
    id: 'prof-1',
    nome: 'Marcos Silva',
    email: 'marcos.silva@escola.edu.br',
    telefone: '(11) 99999-1111',
    disciplina: 'Matemática',
    turmas: ['turma-1', 'turma-3'],
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'prof-2',
    nome: 'Maria Santos',
    email: 'maria.santos@escola.edu.br',
    telefone: '(11) 99999-2222',
    disciplina: 'Português',
    turmas: ['turma-2'],
    createdAt: new Date('2025-01-15')
  }
];

export const mockAlunos: Aluno[] = [
  {
    id: 'aluno-1',
    nome: 'Ana Costa',
    email: 'ana.costa@email.com',
    telefone: '(11) 99999-3333',
    turmaId: 'turma-1',
    responsavel: 'José Costa',
    telefoneResponsavel: '(11) 99999-4444',
    matricula: '2025001',
    createdAt: new Date('2025-02-01')
  },
  {
    id: 'aluno-2',
    nome: 'Lucas Oliveira',
    email: 'lucas.oliveira@email.com',
    telefone: '(11) 99999-5555',
    turmaId: 'turma-1',
    responsavel: 'Maria Oliveira',
    telefoneResponsavel: '(11) 99999-6666',
    matricula: '2025002',
    createdAt: new Date('2025-02-01')
  },
  {
    id: 'aluno-3',
    nome: 'Carla Lima',
    email: 'carla.lima@email.com',
    telefone: '(11) 99999-7777',
    turmaId: 'turma-2',
    responsavel: 'Pedro Lima',
    telefoneResponsavel: '(11) 99999-8888',
    matricula: '2025003',
    createdAt: new Date('2025-02-01')
  },
  {
    id: 'aluno-4',
    nome: 'João Santos',
    email: 'joao.santos@email.com',
    turmaId: 'turma-1',
    responsavel: 'Ana Santos',
    telefoneResponsavel: '(11) 99999-9999',
    matricula: '2025004',
    createdAt: new Date('2025-02-01')
  },
  {
    id: 'aluno-5',
    nome: 'Beatriz Silva',
    email: 'beatriz.silva@email.com',
    turmaId: 'turma-2',
    responsavel: 'Carlos Silva',
    telefoneResponsavel: '(11) 88888-1111',
    matricula: '2025005',
    createdAt: new Date('2025-02-01')
  }
];


export const mockPresencas: Presenca[] = [

  ...Array.from({ length: 30 }, (_, i) => ({
    id: `pres-ana-${i}`,
    alunoId: 'aluno-1',
    turmaId: 'turma-1',
    data: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    presente: i < 2 ? false : Math.random() > 0.1,
    professorId: 'prof-1'
  })),
  

  ...Array.from({ length: 30 }, (_, i) => ({
    id: `pres-lucas-${i}`,
    alunoId: 'aluno-2',
    turmaId: 'turma-1',
    data: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    presente: Math.random() > 0.4,
    professorId: 'prof-1'
  })),


  ...Array.from({ length: 30 }, (_, i) => ({
    id: `pres-carla-${i}`,
    alunoId: 'aluno-3',
    turmaId: 'turma-2',
    data: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    presente: Math.random() > 0.15,
    professorId: 'prof-2'
  }))
];

export const mockNotas: Nota[] = [

  { id: 'nota-1', alunoId: 'aluno-1', turmaId: 'turma-1', professorId: 'prof-1', tipo: 'nota1', valor: 9.5, dataLancamento: new Date('2025-03-15') },
  { id: 'nota-2', alunoId: 'aluno-1', turmaId: 'turma-1', professorId: 'prof-1', tipo: 'nota2', valor: 8.7, dataLancamento: new Date('2025-06-15') },
  { id: 'nota-3', alunoId: 'aluno-1', turmaId: 'turma-1', professorId: 'prof-1', tipo: 'mediaFinal', valor: 9.1, dataLancamento: new Date('2025-09-01') },


  { id: 'nota-4', alunoId: 'aluno-2', turmaId: 'turma-1', professorId: 'prof-1', tipo: 'nota1', valor: 6.2, dataLancamento: new Date('2025-03-15') },
  { id: 'nota-5', alunoId: 'aluno-2', turmaId: 'turma-1', professorId: 'prof-1', tipo: 'nota2', valor: 5.8, dataLancamento: new Date('2025-06-15') },
  { id: 'nota-6', alunoId: 'aluno-2', turmaId: 'turma-1', professorId: 'prof-1', tipo: 'mediaFinal', valor: 6.0, dataLancamento: new Date('2025-09-01') },


  { id: 'nota-7', alunoId: 'aluno-3', turmaId: 'turma-2', professorId: 'prof-2', tipo: 'nota1', valor: 8.1, dataLancamento: new Date('2025-03-15') },
  { id: 'nota-8', alunoId: 'aluno-3', turmaId: 'turma-2', professorId: 'prof-2', tipo: 'nota2', valor: 7.9, dataLancamento: new Date('2025-06-15') },
  { id: 'nota-9', alunoId: 'aluno-3', turmaId: 'turma-2', professorId: 'prof-2', tipo: 'mediaFinal', valor: 8.0, dataLancamento: new Date('2025-09-01') },


  { id: 'nota-10', alunoId: 'aluno-4', turmaId: 'turma-1', professorId: 'prof-1', tipo: 'nota1', valor: 7.5, dataLancamento: new Date('2025-03-15') },
  { id: 'nota-11', alunoId: 'aluno-4', turmaId: 'turma-1', professorId: 'prof-1', tipo: 'nota2', valor: 8.2, dataLancamento: new Date('2025-06-15') },


  { id: 'nota-12', alunoId: 'aluno-5', turmaId: 'turma-2', professorId: 'prof-2', tipo: 'nota1', valor: 9.0, dataLancamento: new Date('2025-03-15') },
  { id: 'nota-13', alunoId: 'aluno-5', turmaId: 'turma-2', professorId: 'prof-2', tipo: 'nota2', valor: 8.8, dataLancamento: new Date('2025-06-15') }
];

export const mockDashboardStats: DashboardStats = {
  totalTurmas: 3,
  totalProfessores: 2,
  totalAlunos: 75,
  alunosEmRisco: 8,
  presencaMedia: 83.5,
  notaMedia: 7.8
};


export const DEFAULT_CREDENTIALS = {
  admin: { username: 'admin', password: 'admin123' },
  professor: { username: 'marcos.silva', password: 'prof123' },
  aluno: { username: 'ana.costa', password: 'aluno123' },
  alunoRisco: { username: 'lucas.oliveira', password: 'lucas123' }
};

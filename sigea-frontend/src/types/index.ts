


export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'professor' | 'aluno';
  email?: string;
  turmaId?: string;
}

export interface Turma {
  id: string;
  nome: string;
  ano: string;
  periodo: 'matutino' | 'vespertino' | 'noturno';
  professorId: string;
  professorNome: string;
  totalAlunos: number;
  createdAt: Date;
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  disciplina: string;
  turmas: string[];
  createdAt: Date;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  turmaId: string;
  responsavel?: string;
  telefoneResponsavel?: string;
  matricula: string;
  createdAt: Date;
}

export interface Presenca {
  id: string;
  alunoId: string;
  turmaId: string;
  data: string;
  presente: boolean;
  professorId: string;
}

export interface Nota {
  id: string;
  alunoId: string;
  turmaId: string;
  professorId: string;
  tipo: 'nota1' | 'nota2' | 'mediaFinal';
  valor: number;
  dataLancamento: Date;
}

export interface DashboardStats {
  totalTurmas: number;
  totalProfessores: number;
  totalAlunos: number;
  alunosEmRisco: number;
  presencaMedia: number;
  notaMedia: number;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

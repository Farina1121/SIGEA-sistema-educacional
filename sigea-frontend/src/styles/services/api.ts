
const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    nome: string;
    email: string;
    perfil: 'admin' | 'professor' | 'aluno';
  };
  usuario?: {
    id: string;
    nome: string;
    email: string;
    tipo: 'admin' | 'professor' | 'aluno';
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}


class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }


  getToken(): string | null {
    return localStorage.getItem('sigea_token');
  }


  setToken(token: string | null): void {
    if (token) {
      localStorage.setItem('sigea_token', token);
    } else {
      localStorage.removeItem('sigea_token');
    }
  }


  getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }


  async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: 'GET',
      headers: this.getHeaders(options.auth !== false),
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      

      if (error instanceof Error && (error.message?.includes('Token') || error.message?.includes('401'))) {
        this.setToken(null);
      }
      
      throw error;
    }
  }


  get(endpoint: string, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint: string, body?: any, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint: string, body?: any, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint: string, options: RequestOptions = {}): Promise<any> {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}


const apiService = new ApiService();




export const authService = {
  async login(email: string, senha: string): Promise<LoginResponse> {
    const response = await apiService.post('/auth/login', { email, senha }, { auth: false });
    
    if (response.token) {
      apiService.setToken(response.token);
    }
    
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout', undefined);
    } catch (error) {
      console.log('Erro no logout:', error);
    } finally {
      apiService.setToken(null);
    }
  },

  async getMe(): Promise<any> {
    return apiService.get('/auth/me');
  },

  async register(userData: any): Promise<any> {
    return apiService.post('/auth/register', userData);
  },

  isAuthenticated(): boolean {
    return !!apiService.getToken();
  }
};


export const usuarioService = {
  async getAll(): Promise<any[]> {
    return apiService.get('/usuarios');
  },

  async getById(id: string): Promise<any> {
    return apiService.get(`/usuarios/${id}`);
  },

  async update(id: string, userData: any): Promise<any> {
    return apiService.put(`/usuarios/${id}`, userData);
  },

  async delete(id: string): Promise<void> {
    return apiService.delete(`/usuarios/${id}`);
  }
};


export const turmaService = {
  async getAll(): Promise<any[]> {
    return apiService.get('/turmas');
  },

  async getById(id: string): Promise<any> {
    return apiService.get(`/turmas/${id}`);
  },

  async create(turmaData: any): Promise<any> {
    return apiService.post('/turmas', turmaData);
  },

  async update(id: string, turmaData: any): Promise<any> {
    return apiService.put(`/turmas/${id}`, turmaData);
  },

  async delete(id: string): Promise<void> {
    return apiService.delete(`/turmas/${id}`);
  }
};


export const professorService = {
  async getAll(): Promise<any[]> {
    return apiService.get('/professores');
  },

  async getById(id: string): Promise<any> {
    return apiService.get(`/professores/${id}`);
  }
};


export const alunoService = {
  async getAll(): Promise<any[]> {
    return apiService.get('/alunos');
  },

  async getById(id: string): Promise<any> {
    return apiService.get(`/alunos/${id}`);
  },

  async getByTurma(turmaId: string): Promise<any[]> {
    return apiService.get(`/alunos?turmaId=${turmaId}`);
  }
};


export const notaService = {
  async getAll(params: Record<string, string> = {}): Promise<any[]> {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/notas?${queryString}` : '/notas';
    return apiService.get(endpoint);
  },

  async getByAluno(alunoId: string): Promise<any[]> {
    return apiService.get(`/notas?alunoId=${alunoId}`);
  },

  async create(notaData: any): Promise<any> {
    return apiService.post('/notas', notaData);
  },

  async update(id: string, notaData: any): Promise<any> {
    return apiService.put(`/notas/${id}`, notaData);
  },

  async delete(id: string): Promise<void> {
    return apiService.delete(`/notas/${id}`);
  }
};


export const chamadaService = {
  async getAll(params: Record<string, string> = {}): Promise<any[]> {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/chamadas?${queryString}` : '/chamadas';
    return apiService.get(endpoint);
  },

  async getByTurma(turmaId: string): Promise<any[]> {
    return apiService.get(`/chamadas?turmaId=${turmaId}`);
  },

  async getPresencasByAluno(alunoId: string): Promise<any[]> {
    return apiService.get(`/chamadas/presenca/${alunoId}`);
  },

  async create(chamadaData: any): Promise<any> {
    return apiService.post('/chamadas', chamadaData);
  },

  async update(id: string, chamadaData: any): Promise<any> {
    return apiService.put(`/chamadas/${id}`, chamadaData);
  }
};


export const healthService = {
  async check(): Promise<any> {
    return apiService.get('/health', { auth: false });
  }
};

export default apiService;

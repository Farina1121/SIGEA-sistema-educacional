


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authService } from '../styles/services/api';
import { mockUsers, DEFAULT_CREDENTIALS } from '../data/mockData';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const storedUser = localStorage.getItem('sigea_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao recuperar usuário do localStorage:', error);
        localStorage.removeItem('sigea_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {

      try {
        const response = await authService.login(username, password);
        
        if (response.user && response.token) {
          const userData: User = {
            id: response.user.id.toString(),
            name: response.user.nome,
            email: response.user.email,
            role: response.user.perfil,
            username: response.user.email
          };
          
          setUser(userData);
          localStorage.setItem('sigea_user', JSON.stringify(userData));
          setIsLoading(false);
          return true;
        }
      } catch (apiError) {
        console.log('API não disponível, usando dados mockados:', apiError);
        

        await new Promise(resolve => setTimeout(resolve, 1000));

        const isValidCredential = 
          (username === DEFAULT_CREDENTIALS.admin.username && password === DEFAULT_CREDENTIALS.admin.password) ||
          (username === DEFAULT_CREDENTIALS.professor.username && password === DEFAULT_CREDENTIALS.professor.password) ||
          (username === DEFAULT_CREDENTIALS.aluno.username && password === DEFAULT_CREDENTIALS.aluno.password) ||
          (username === DEFAULT_CREDENTIALS.alunoRisco.username && password === DEFAULT_CREDENTIALS.alunoRisco.password);

        if (isValidCredential) {
          const foundUser = mockUsers.find(u => u.username === username);
          if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('sigea_user', JSON.stringify(foundUser));
            setIsLoading(false);
            return true;
          }
        }
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {

      await authService.logout();
    } catch (error) {
      console.log('Erro no logout da API:', error);
    } finally {

      setUser(null);
      localStorage.removeItem('sigea_user');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

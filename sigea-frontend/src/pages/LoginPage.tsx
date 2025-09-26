


import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Alert, Card, CardHeader, CardBody } from '../components/ui';
import { DEFAULT_CREDENTIALS } from '../data/mockData';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const success = await login(formData.username, formData.password);
    if (!success) {
      setError('Credenciais inválidas. Verifique seu usuário e senha.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) {
      setError('');
    }
  };

  const fillCredentials = (role: keyof typeof DEFAULT_CREDENTIALS) => {
    const credentials = DEFAULT_CREDENTIALS[role];
    setFormData({
      username: credentials.username,
      password: credentials.password
    });
    setError('');
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardHeader className="login-header">
          <h1 className="login-logo">SIGEA</h1>
          <p className="login-subtitle">Sistema de Gestão de Aulas</p>
        </CardHeader>
        
        <CardBody className="login-form">
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="error" className="animate-fade-in">
                {error}
              </Alert>
            )}

            <Input
              label="Usuário"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Digite seu usuário"
              required
              autoComplete="username"
            />

            <Input
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Entrar
            </Button>
          </form>

          <div className="login-demo-section">
            <div className="login-demo-header">
              <p className="text-small text-secondary">Demonstração do Sistema</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowCredentials(!showCredentials)}
              >
                {showCredentials ? 'Ocultar' : 'Mostrar'} Credenciais
              </Button>
            </div>

            {showCredentials && (
              <div className="animate-fade-in login-credentials-grid">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fillCredentials('admin')}
                  className="text-left"
                >
                  Administrador - Cláudia Ferreira
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fillCredentials('professor')}
                  className="text-left"
                >
                  Professor - Marcos Silva
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fillCredentials('aluno')}
                  className="text-left"
                >
                  Aluna - Ana Costa (Dedicada)
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fillCredentials('alunoRisco')}
                  className="text-left"
                >
                  Aluno - Lucas Oliveira (Precisa apoio)
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

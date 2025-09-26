


import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      professor: 'Professor',
      aluno: 'Aluno'
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <a href="/" className="header-logo">
            SIGEA
          </a>
          
          <div className="header-user">
            <div>
              <div className="header-user-name">{user.name}</div>
              <div className="header-user-role">{getRoleLabel(user.role)}</div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={logout}
              className="header-logout"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="main-layout">
        {children}
      </main>
    </div>
  );
};

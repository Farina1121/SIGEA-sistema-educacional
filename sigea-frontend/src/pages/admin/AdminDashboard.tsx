


import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Badge, Modal, Input, Select, Alert } from '../../components/ui';
import { mockTurmas, mockProfessores, mockAlunos, mockDashboardStats } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'turmas' | 'professores' | 'alunos'>('overview');
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const stats = mockDashboardStats;

  const handleCreate = (type: 'turma' | 'professor' | 'aluno') => {
    setSelectedItem(null);
    setModalOpen(type);
  };

  const handleEdit = (item: any, type: string) => {
    setSelectedItem(item);
    setModalOpen(type);
  };

  const handleSave = (type: string) => {
    setModalOpen(null);
    setSelectedItem(null);
    setAlert({ type: 'success', message: `${type.charAt(0).toUpperCase() + type.slice(1)} salvo com sucesso!` });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = (_id: string, type: string) => {
    if (confirm(`Tem certeza que deseja excluir este ${type}?`)) {
      setAlert({ type: 'success', message: `${type.charAt(0).toUpperCase() + type.slice(1)} excluído com sucesso!` });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const renderOverview = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Administrativo</h1>
        <p className="dashboard-subtitle">Visão geral do sistema - Bem-vinda, Cláudia!</p>
      </div>

      {alert && (
        <Alert variant={alert.type} className="animate-fade-in">
          {alert.message}
        </Alert>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTurmas}</div>
          <div className="stat-label">Turmas Ativas</div>
          <div className="stat-change positive">+2 este semestre</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.totalProfessores}</div>
          <div className="stat-label">Professores</div>
          <div className="stat-change positive">+1 contratado</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.totalAlunos}</div>
          <div className="stat-label">Alunos Matriculados</div>
          <div className="stat-change positive">+12 este ano</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.alunosEmRisco}</div>
          <div className="stat-label">Alunos em Risco</div>
          <div className="stat-change negative">Requer atenção</div>
        </div>
      </div>

      <div className="content-grid">
        <Card className="content-section">
          <CardHeader className="section-header">
            <h3 className="section-title">Indicadores de Desempenho</h3>
          </CardHeader>
          <CardBody className="section-content">
            <div className="progress-item">
              <div className="progress-label">
                <span>Presença Média</span>
                <span>{stats.presencaMedia}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${stats.presencaMedia < 75 ? 'danger' : stats.presencaMedia < 85 ? 'warning' : ''} progress-width-${Math.round(stats.presencaMedia)}`}
                />
              </div>
            </div>
            
            <div className="progress-item">
              <div className="progress-label">
                <span>Nota Média Geral</span>
                <span>{stats.notaMedia.toFixed(1)}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${stats.notaMedia < 6 ? 'danger' : stats.notaMedia < 7 ? 'warning' : ''} progress-width-${Math.round((stats.notaMedia / 10) * 100)}`}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="content-section">
          <CardHeader className="section-header">
            <h3 className="section-title">Alertas Pedagógicos</h3>
          </CardHeader>
          <CardBody className="section-content">
            <div className="student-risk-alert student-risk-high">
              <strong>8 alunos em risco acadêmico</strong>
              <p>Alunos com média abaixo de 6.0 ou presença inferior a 75%</p>
            </div>
            
            <div className="student-risk-alert">
              <strong>3 turmas precisam de acompanhamento</strong>
              <p>Turmas com desempenho abaixo da média esperada</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );

  const renderTurmas = () => (
    <Card className="content-section">
      <CardHeader className="section-header">
        <h3 className="section-title">Gerenciar Turmas</h3>
        <Button variant="primary" onClick={() => handleCreate('turma')}>
          Nova Turma
        </Button>
      </CardHeader>
      <CardBody>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome da Turma</th>
                <th>Professor</th>
                <th>Período</th>
                <th>Total de Alunos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockTurmas.map((turma) => (
                <tr key={turma.id}>
                  <td>{turma.nome}</td>
                  <td>{turma.professorNome}</td>
                  <td>
                    <Badge variant={
                      turma.periodo === 'matutino' ? 'info' : 
                      turma.periodo === 'vespertino' ? 'warning' : 'success'
                    }>
                      {turma.periodo}
                    </Badge>
                  </td>
                  <td>{turma.totalAlunos}</td>
                  <td>
                    <div className="action-buttons">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleEdit(turma, 'turma')}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(turma.id, 'turma')}
                      >
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );

  const renderProfessores = () => (
    <Card className="content-section">
      <CardHeader className="section-header">
        <h3 className="section-title">Gerenciar Professores</h3>
        <Button variant="primary" onClick={() => handleCreate('professor')}>
          Novo Professor
        </Button>
      </CardHeader>
      <CardBody>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Disciplina</th>
                <th>Turmas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockProfessores.map((professor) => (
                <tr key={professor.id}>
                  <td>{professor.nome}</td>
                  <td>{professor.email}</td>
                  <td>{professor.disciplina}</td>
                  <td>
                    <Badge variant="info">
                      {professor.turmas.length} turmas
                    </Badge>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleEdit(professor, 'professor')}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(professor.id, 'professor')}
                      >
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );

  const renderAlunos = () => (
    <Card className="content-section">
      <CardHeader className="section-header">
        <h3 className="section-title">Gerenciar Alunos</h3>
        <Button variant="primary" onClick={() => handleCreate('aluno')}>
          Novo Aluno
        </Button>
      </CardHeader>
      <CardBody>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Turma</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockAlunos.map((aluno) => {
                const turma = mockTurmas.find(t => t.id === aluno.turmaId);
                return (
                  <tr key={aluno.id}>
                    <td>{aluno.nome}</td>
                    <td>{aluno.matricula}</td>
                    <td>{turma?.nome || 'N/A'}</td>
                    <td>{aluno.responsavel || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleEdit(aluno, 'aluno')}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDelete(aluno.id, 'aluno')}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="main-layout">
      <nav className="sidebar">
        <div className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
             Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'turmas' ? 'active' : ''}`}
            onClick={() => setActiveTab('turmas')}
          >
             Turmas
          </button>
          <button
            className={`nav-item ${activeTab === 'professores' ? 'active' : ''}`}
            onClick={() => setActiveTab('professores')}
          >
            Professores
          </button>
          <button
            className={`nav-item ${activeTab === 'alunos' ? 'active' : ''}`}
            onClick={() => setActiveTab('alunos')}
          >
            Alunos
          </button>
        </div>
      </nav>

      <div className="content-wrapper">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'turmas' && renderTurmas()}
        {activeTab === 'professores' && renderProfessores()}
        {activeTab === 'alunos' && renderAlunos()}
      </div>

      <Modal
        isOpen={modalOpen === 'turma'}
        onClose={() => setModalOpen(null)}
        title={selectedItem ? 'Editar Turma' : 'Nova Turma'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(null)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => handleSave('turma')}>
              Salvar
            </Button>
          </>
        }
      >
        <Input label="Nome da Turma" placeholder="Ex: 3º Ano A" required />
        <Input label="Ano Letivo" placeholder="2025" required />
        <Select label="Período" required>
          <option value="">Selecione o período</option>
          <option value="matutino">Matutino</option>
          <option value="vespertino">Vespertino</option>
          <option value="noturno">Noturno</option>
        </Select>
        <Select label="Professor" required>
          <option value="">Selecione o professor</option>
          {mockProfessores.map(prof => (
            <option key={prof.id} value={prof.id}>{prof.nome}</option>
          ))}
        </Select>
      </Modal>

      <Modal
        isOpen={modalOpen === 'professor'}
        onClose={() => setModalOpen(null)}
        title={selectedItem ? 'Editar Professor' : 'Novo Professor'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(null)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => handleSave('professor')}>
              Salvar
            </Button>
          </>
        }
      >
        <Input label="Nome Completo" placeholder="Ex: João Silva" required />
        <Input label="Email" type="email" placeholder="joao@escola.edu.br" required />
        <Input label="Telefone" placeholder="(11) 99999-9999" />
        <Input label="Disciplina" placeholder="Ex: Matemática" required />
      </Modal>

      <Modal
        isOpen={modalOpen === 'aluno'}
        onClose={() => setModalOpen(null)}
        title={selectedItem ? 'Editar Aluno' : 'Novo Aluno'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(null)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => handleSave('aluno')}>
              Salvar
            </Button>
          </>
        }
      >
        <Input label="Nome Completo" placeholder="Ex: Maria Silva" required />
        <Input label="Email" type="email" placeholder="maria@email.com" />
        <Input label="Telefone" placeholder="(11) 99999-9999" />
        <Input label="Matrícula" placeholder="2025001" required />
        <Select label="Turma" required>
          <option value="">Selecione a turma</option>
          {mockTurmas.map(turma => (
            <option key={turma.id} value={turma.id}>{turma.nome}</option>
          ))}
        </Select>
        <Input label="Nome do Responsável" placeholder="Ex: José Silva" />
        <Input label="Telefone do Responsável" placeholder="(11) 99999-9999" />
      </Modal>
    </div>
  );
};

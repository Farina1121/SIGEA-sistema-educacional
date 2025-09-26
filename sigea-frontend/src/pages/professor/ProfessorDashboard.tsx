


import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Badge, Alert } from '../../components/ui';
import { mockTurmas, mockAlunos, mockPresencas, mockNotas } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export const ProfessorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'turmas' | 'chamada' | 'notas'>('turmas');
  const [selectedTurma, setSelectedTurma] = useState<string | null>(null);
  const [chamadaData, setChamadaData] = useState<{ [key: string]: boolean }>({});
  const [notasData, setNotasData] = useState<{ [key: string]: { nota1?: number; nota2?: number; mediaFinal?: number } }>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);


  const professorTurmas = mockTurmas.filter(turma => turma.professorId === user?.id);
  const selectedTurmaData = mockTurmas.find(turma => turma.id === selectedTurma);
  const alunosDaTurma = selectedTurma ? mockAlunos.filter(aluno => aluno.turmaId === selectedTurma) : [];

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSalvarChamada = () => {

    console.log('Salvando chamada:', chamadaData);
    showAlert('success', 'Chamada salva com sucesso!');
    setChamadaData({});
  };

  const handleSalvarNotas = () => {

    console.log('Salvando notas:', notasData);
    showAlert('success', 'Notas salvas com sucesso!');
  };

  const getPresencaStatus = (alunoId: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    const presenca = mockPresencas.find(p => p.alunoId === alunoId && p.data === hoje);
    return presenca?.presente ?? null;
  };

  const getNotasAluno = (alunoId: string) => {
    const notas = mockNotas.filter(nota => nota.alunoId === alunoId);
    return {
      nota1: notas.find(n => n.tipo === 'nota1')?.valor || 0,
      nota2: notas.find(n => n.tipo === 'nota2')?.valor || 0,
      mediaFinal: notas.find(n => n.tipo === 'mediaFinal')?.valor || 0
    };
  };

  const getPresencaPercentual = (alunoId: string) => {
    const presencasAluno = mockPresencas.filter(p => p.alunoId === alunoId);
    const totalDias = presencasAluno.length;
    const diasPresentes = presencasAluno.filter(p => p.presente).length;
    return totalDias > 0 ? Math.round((diasPresentes / totalDias) * 100) : 0;
  };

  const renderTurmas = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Minhas Turmas</h1>
        <p className="dashboard-subtitle">Bem-vindo, {user?.name}! Selecione uma turma para começar.</p>
      </div>

      {alert && (
        <Alert variant={alert.type} className="animate-fade-in">
          {alert.message}
        </Alert>
      )}

      <div className="stats-grid">
        {professorTurmas.map((turma) => (
          <Card key={turma.id} className="stat-card turma-card">
            <CardBody>
              <h3 className="card-title">{turma.nome}</h3>
              <p className="text-secondary">Período: {turma.periodo}</p>
              <p className="text-secondary">Alunos: {turma.totalAlunos}</p>
              <div className="turma-actions">
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedTurma(turma.id);
                    setActiveTab('chamada');
                  }}
                >
                  Lançar Chamada
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedTurma(turma.id);
                    setActiveTab('notas');
                  }}
                >
                  Gerenciar Notas
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {professorTurmas.length === 0 && (
        <Card>
          <CardBody>
            <p>Você não possui turmas cadastradas no momento.</p>
          </CardBody>
        </Card>
      )}
    </div>
  );

  const renderChamada = () => {
    if (!selectedTurma || !selectedTurmaData) {
      return (
        <Card>
          <CardBody>
            <p>Selecione uma turma primeiro.</p>
            <Button variant="secondary" onClick={() => setActiveTab('turmas')}>
              Voltar às Turmas
            </Button>
          </CardBody>
        </Card>
      );
    }

    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Chamada - {selectedTurmaData.nome}</h1>
          <p className="dashboard-subtitle">
            Data: {new Date().toLocaleDateString('pt-BR')} | 
            Total de alunos: {alunosDaTurma.length}
          </p>
        </div>

        {alert && (
          <Alert variant={alert.type} className="animate-fade-in">
            {alert.message}
          </Alert>
        )}

        <Card className="content-section">
          <CardHeader className="section-header">
            <h3 className="section-title">Lista de Chamada</h3>
            <div className="section-actions">
              <Button variant="secondary" onClick={() => setActiveTab('turmas')}>
                Voltar às Turmas
              </Button>
              <Button 
                variant="success" 
                onClick={handleSalvarChamada}
                disabled={Object.keys(chamadaData).length === 0}
              >
                Salvar Chamada
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="chamada-grid">
              {alunosDaTurma.map((aluno) => {
                const presencaStatus = getPresencaStatus(aluno.id);
                const presencaAtual = chamadaData[aluno.id] ?? presencaStatus ?? true;
                
                return (
                  <div key={aluno.id} className="chamada-item">
                    <div className="aluno-info">
                      <h4>{aluno.nome}</h4>
                      <p className="text-small text-secondary">Mat: {aluno.matricula}</p>
                      <div className="presenca-stats">
                        <span className="text-small">
                          Frequência: {getPresencaPercentual(aluno.id)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="presenca-controls">
                      <Button
                        variant={presencaAtual ? "success" : "secondary"}
                        size="sm"
                        onClick={() => setChamadaData(prev => ({ ...prev, [aluno.id]: true }))}
                      >
                        Presente
                      </Button>
                      <Button
                        variant={!presencaAtual ? "danger" : "secondary"}
                        size="sm"
                        onClick={() => setChamadaData(prev => ({ ...prev, [aluno.id]: false }))}
                      >
                        Falta
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  };

  const renderNotas = () => {
    if (!selectedTurma || !selectedTurmaData) {
      return (
        <Card>
          <CardBody>
            <p>Selecione uma turma primeiro.</p>
            <Button variant="secondary" onClick={() => setActiveTab('turmas')}>
              Voltar às Turmas
            </Button>
          </CardBody>
        </Card>
      );
    }

    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Notas - {selectedTurmaData.nome}</h1>
          <p className="dashboard-subtitle">
            Gerenciar notas dos alunos | Total: {alunosDaTurma.length} alunos
          </p>
        </div>

        {alert && (
          <Alert variant={alert.type} className="animate-fade-in">
            {alert.message}
          </Alert>
        )}

        <Card className="content-section">
          <CardHeader className="section-header">
            <h3 className="section-title">Lançamento de Notas</h3>
            <div className="section-actions">
              <Button variant="secondary" onClick={() => setActiveTab('turmas')}>
                Voltar às Turmas
              </Button>
              <Button variant="success" onClick={handleSalvarNotas}>
                Salvar Notas
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Matrícula</th>
                    <th>Nota 1</th>
                    <th>Nota 2</th>
                    <th>Média Final</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosDaTurma.map((aluno) => {
                    const notasExistentes = getNotasAluno(aluno.id);
                    const notasAtuais = notasData[aluno.id] || notasExistentes;
                    const media = notasAtuais.mediaFinal || 
                      (((notasAtuais.nota1 || 0) + (notasAtuais.nota2 || 0)) / 2);
                    
                    return (
                      <tr key={aluno.id}>
                        <td>
                          <div>
                            <strong>{aluno.nome}</strong>
                            <div className="text-small text-secondary">
                              Freq: {getPresencaPercentual(aluno.id)}%
                            </div>
                          </div>
                        </td>
                        <td>{aluno.matricula}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            className="grade-input form-input"
                            value={notasAtuais.nota1 || ''}
                            placeholder="0.0"
                            title={`Nota 1 de ${aluno.nome}`}
                            aria-label={`Nota 1 de ${aluno.nome}`}
                            onChange={(e) => {
                              const valor = parseFloat(e.target.value) || 0;
                              setNotasData(prev => ({
                                ...prev,
                                [aluno.id]: { ...prev[aluno.id], nota1: valor }
                              }));
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            className="grade-input form-input"
                            value={notasAtuais.nota2 || ''}
                            placeholder="0.0"
                            title={`Nota 2 de ${aluno.nome}`}
                            aria-label={`Nota 2 de ${aluno.nome}`}
                            onChange={(e) => {
                              const valor = parseFloat(e.target.value) || 0;
                              setNotasData(prev => ({
                                ...prev,
                                [aluno.id]: { ...prev[aluno.id], nota2: valor }
                              }));
                            }}
                          />
                        </td>
                        <td>
                          <div className={`grade-display ${
                            media >= 8 ? 'excellent' : 
                            media >= 6 ? 'good' : 'needs-improvement'
                          }`}>
                            {media.toFixed(1)}
                          </div>
                        </td>
                        <td>
                          <Badge variant={
                            media >= 6 && getPresencaPercentual(aluno.id) >= 75 ? 'success' : 'warning'
                          }>
                            {media >= 6 && getPresencaPercentual(aluno.id) >= 75 ? 'Aprovado' : 'Em Risco'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  };

  return (
    <div className="main-layout">
      <nav className="sidebar">
        <div className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'turmas' ? 'active' : ''}`}
            onClick={() => setActiveTab('turmas')}
          >
            Minhas Turmas
          </button>
          {selectedTurma && (
            <>
              <button
                className={`nav-item ${activeTab === 'chamada' ? 'active' : ''}`}
                onClick={() => setActiveTab('chamada')}
              >
                Chamada
              </button>
              <button
                className={`nav-item ${activeTab === 'notas' ? 'active' : ''}`}
                onClick={() => setActiveTab('notas')}
              >
                Notas
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="content-wrapper">
        {activeTab === 'turmas' && renderTurmas()}
        {activeTab === 'chamada' && renderChamada()}
        {activeTab === 'notas' && renderNotas()}
      </div>
    </div>
  );
};

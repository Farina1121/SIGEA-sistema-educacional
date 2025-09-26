


import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Badge, Alert } from '../../components/ui';
import { mockTurmas, mockAlunos, mockPresencas, mockNotas } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export const AlunoDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notas' | 'presenca'>('dashboard');


  const aluno = mockAlunos.find(a => a.id === user?.id);
  const turma = aluno ? mockTurmas.find(t => t.id === aluno.turmaId) : null;
  const notasAluno = mockNotas.filter(nota => nota.alunoId === user?.id);
  const presencasAluno = mockPresencas.filter(p => p.alunoId === user?.id);


  const calcularEstatisticas = () => {
    if (!aluno) return null;

    const totalDias = presencasAluno.length;
    const diasPresentes = presencasAluno.filter(p => p.presente).length;
    const percentualPresenca = totalDias > 0 ? Math.round((diasPresentes / totalDias) * 100) : 0;

    const nota1 = notasAluno.find(n => n.tipo === 'nota1')?.valor || 0;
    const nota2 = notasAluno.find(n => n.tipo === 'nota2')?.valor || 0;
    const mediaFinal = notasAluno.find(n => n.tipo === 'mediaFinal')?.valor || ((nota1 + nota2) / 2);


    const emRisco = mediaFinal < 6 || percentualPresenca < 75;
    const statusAprovacao = mediaFinal >= 6 && percentualPresenca >= 75 ? 'aprovado' : 'risco';

    return {
      nota1,
      nota2,
      mediaFinal,
      percentualPresenca,
      diasPresentes,
      totalDias,
      faltas: totalDias - diasPresentes,
      emRisco,
      statusAprovacao
    };
  };

  const stats = calcularEstatisticas();


  const isLucas = stats?.emRisco || false;
  const persona = isLucas ? 'lucas' : 'ana';

  const renderMotivationalMessage = () => {
    if (!stats) return null;

    if (persona === 'ana') {
      return (
        <div className="motivational-card">
          <div className="motivational-message">
            Parabéns, {user?.name}!
          </div>
          <div className="motivational-submessage">
            Você está indo muito bem! Continue assim e mantenha o foco nos seus objetivos.
          </div>
        </div>
      );
    } else {
      return (
        <div className="student-risk-alert student-risk-high">
          <div className="motivational-message">
            Vamos juntos, {user?.name}!
          </div>
          <div className="motivational-submessage">
            Você tem potencial! Vamos focar nas próximas atividades para melhorar seu desempenho.
          </div>
        </div>
      );
    }
  };

  const renderDashboard = () => {
    if (!aluno || !turma || !stats) {
      return (
        <Card>
          <CardBody>
            <p>Erro ao carregar dados do aluno.</p>
          </CardBody>
        </Card>
      );
    }

    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Meu Painel</h1>
          <p className="dashboard-subtitle">
            Olá, {user?.name}! Aqui está seu progresso na turma {turma.nome}
          </p>
        </div>

        {renderMotivationalMessage()}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.mediaFinal.toFixed(1)}</div>
            <div className="stat-label">Média Geral</div>
            <div className={`stat-change ${stats.mediaFinal >= 6 ? 'positive' : 'negative'}`}>
              {stats.mediaFinal >= 6 ? 'Aprovado' : 'Precisa melhorar'}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.percentualPresenca}%</div>
            <div className="stat-label">Frequência</div>
            <div className={`stat-change ${stats.percentualPresenca >= 75 ? 'positive' : 'negative'}`}>
              {stats.diasPresentes}/{stats.totalDias} aulas
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.faltas}</div>
            <div className="stat-label">Faltas</div>
            <div className={`stat-change ${stats.faltas <= 5 ? 'positive' : 'negative'}`}>
              {stats.faltas <= 5 ? 'Dentro do limite' : 'Atenção necessária'}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              <Badge variant={stats.statusAprovacao === 'aprovado' ? 'success' : 'warning'}>
                {stats.statusAprovacao === 'aprovado' ? 'Aprovado' : 'Em Risco'}
              </Badge>
            </div>
            <div className="stat-label">Status Atual</div>
          </div>
        </div>

        <div className="content-grid">
          <Card className="content-section">
            <CardHeader className="section-header">
              <h3 className="section-title">Meu Progresso</h3>
            </CardHeader>
            <CardBody className="section-content">
              <div className="progress-item">
                <div className="progress-label">
                  <span>Média Geral</span>
                  <span>{stats.mediaFinal.toFixed(1)}/10</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill progress-width-${Math.round((stats.mediaFinal / 10) * 100)} ${
                      stats.mediaFinal < 6 ? 'danger' : stats.mediaFinal < 7 ? 'warning' : ''
                    }`}
                  />
                </div>
              </div>
              
              <div className="progress-item">
                <div className="progress-label">
                  <span>Frequência</span>
                  <span>{stats.percentualPresenca}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill progress-width-${stats.percentualPresenca} ${
                      stats.percentualPresenca < 75 ? 'danger' : stats.percentualPresenca < 85 ? 'warning' : ''
                    }`}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="content-section">
            <CardHeader className="section-header">
              <h3 className="section-title">Próximos Passos</h3>
            </CardHeader>
            <CardBody className="section-content">
              {persona === 'ana' ? (
                <div>
                  <h4>Metas da Ana (Estudante Dedicada)</h4>
                  <ul className="goals-list">
                    <li>Manter média acima de 8.0</li>
                    <li>Manter frequência acima de 90%</li>
                    <li>Ajudar colegas com dificuldades</li>
                    <li>Participar de atividades extras</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <h4>Plano de Apoio do Lucas</h4>
                  <ul className="goals-list">
                    <li>Melhorar frequência (meta: 80%)</li>
                    <li>Aumentar média para 6.0+</li>
                    <li>Foco nas próximas atividades</li>
                    <li>Buscar ajuda quando necessário</li>
                  </ul>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    );
  };

  const renderNotas = () => {
    if (!stats) return null;

    return (
      <Card className="content-section">
        <CardHeader className="section-header">
          <h3 className="section-title">Minhas Notas</h3>
        </CardHeader>
        <CardBody>
          <div className="notas-grid">
            <div className="nota-card">
              <h4>Primeira Avaliação</h4>
              <div className={`grade-display ${
                stats.nota1 >= 8 ? 'excellent' : 
                stats.nota1 >= 6 ? 'good' : 'needs-improvement'
              }`}>
                {stats.nota1.toFixed(1)}
              </div>
              <p className="text-small text-secondary">
                {stats.nota1 >= 6 ? 'Ótimo trabalho!' : 'Vamos melhorar na próxima!'}
              </p>
            </div>

            <div className="nota-card">
              <h4>Segunda Avaliação</h4>
              <div className={`grade-display ${
                stats.nota2 >= 8 ? 'excellent' : 
                stats.nota2 >= 6 ? 'good' : 'needs-improvement'
              }`}>
                {stats.nota2 > 0 ? stats.nota2.toFixed(1) : '--'}
              </div>
              <p className="text-small text-secondary">
                {stats.nota2 === 0 ? 'Aguardando avaliação' : 
                 stats.nota2 >= 6 ? 'Excelente!' : 'Continue se esforçando!'}
              </p>
            </div>

            <div className="nota-card media-card">
              <h4>Média Final</h4>
              <div className={`grade-display ${
                stats.mediaFinal >= 8 ? 'excellent' : 
                stats.mediaFinal >= 6 ? 'good' : 'needs-improvement'
              }`}>
                {stats.mediaFinal.toFixed(1)}
              </div>
              <p className="text-small text-secondary">
                {stats.mediaFinal >= 6 ? 
                  'Aprovado! Parabéns!' : 
                  'Vamos conseguir melhorar!'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  const renderPresenca = () => {
    if (!stats) return null;


    const ultimasPresencas = presencasAluno
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 10);

    return (
      <Card className="content-section">
        <CardHeader className="section-header">
          <h3 className="section-title">Minha Frequência</h3>
        </CardHeader>
        <CardBody>
          <div className="presenca-stats-summary">
            <div className="presenca-stat">
              <span className="presenca-number">{stats.diasPresentes}</span>
              <span className="presenca-label">Presenças</span>
            </div>
            <div className="presenca-stat">
              <span className="presenca-number">{stats.faltas}</span>
              <span className="presenca-label">Faltas</span>
            </div>
            <div className="presenca-stat">
              <span className="presenca-number">{stats.percentualPresenca}%</span>
              <span className="presenca-label">Frequência</span>
            </div>
          </div>

          <h4>Últimas 10 Aulas</h4>
          <div className="presenca-timeline">
            {ultimasPresencas.map((presenca) => (
              <div key={presenca.id} className="presenca-day">
                <div className={`attendance-indicator ${presenca.presente ? 'present' : 'absent'}`}>
                  {presenca.presente ? 'P' : 'F'}
                </div>
                <span className="presenca-date">
                  {new Date(presenca.data).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>

          {stats.percentualPresenca < 75 && (
            <Alert variant="warning">
              <strong>Atenção com a frequência!</strong>
              <br />
              Você precisa manter pelo menos 75% de presença. 
              Evite faltas desnecessárias nas próximas aulas.
            </Alert>
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="main-layout">
      <nav className="sidebar">
        <div className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Meu Painel
          </button>
          <button
            className={`nav-item ${activeTab === 'notas' ? 'active' : ''}`}
            onClick={() => setActiveTab('notas')}
          >
            Minhas Notas
          </button>
          <button
            className={`nav-item ${activeTab === 'presenca' ? 'active' : ''}`}
            onClick={() => setActiveTab('presenca')}
          >
            Minha Frequência
          </button>
        </div>
      </nav>

      <div className="content-wrapper">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'notas' && renderNotas()}
        {activeTab === 'presenca' && renderPresenca()}
      </div>
    </div>
  );
};

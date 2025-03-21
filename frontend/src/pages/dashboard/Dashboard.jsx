import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderOpen, AlertCircle, Calendar, Activity, Clock } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/projects');
        setProjects(response.data);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        setError('Falha ao carregar a lista de projetos. Verifique se o servidor está rodando.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const recentActivities = [
    { id: 1, type: 'document', user: 'Carlos Silva', action: 'adicionou', item: 'Relatório Mensal', project: 'Edifício Comercial', time: '2h atrás' },
    { id: 2, type: 'model', user: 'Ana Oliveira', action: 'atualizou', item: 'Modelo Estrutural', project: 'Residencial Park', time: '3h atrás' },
    { id: 3, type: 'issue', user: 'Ricardo Mendes', action: 'resolveu', item: 'Problema #42', project: 'Hospital Central', time: '5h atrás' },
    { id: 4, type: 'schedule', user: 'Patricia Santos', action: 'alterou', item: 'cronograma', project: 'Shopping Plaza', time: '1d atrás' }
  ];
  
  const activityIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText size={16} className="text-blue-500" />;
      case 'model':
        return <FolderOpen size={16} className="text-green-500" />;
      case 'issue':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'schedule':
        return <Calendar size={16} className="text-purple-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <button className="btn btn-primary">
          Novo Projeto
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Documentos</p>
            <h3 className="text-xl font-bold">{projects.reduce((acc, project) => acc + (project.stats?.documents || 0), 0)}</h3>
          </div>
        </div>
        
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
            <FolderOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Modelos</p>
            <h3 className="text-xl font-bold">{projects.reduce((acc, project) => acc + (project.stats?.models || 0), 0)}</h3>
          </div>
        </div>
        
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Issues Pendentes</p>
            <h3 className="text-xl font-bold">{projects.reduce((acc, project) => acc + (project.stats?.issues || 0), 0)}</h3>
          </div>
        </div>
        
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Projetos Ativos</p>
            <h3 className="text-xl font-bold">{projects.length}</h3>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projetos Recentes */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Projetos Recentes</h3>
            
            {loading ? (
              <div className="text-center py-4">
                <p>Carregando projetos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                <p>{error}</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>Nenhum projeto encontrado.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-th">Nome</th>
                      <th className="table-th">Documentos</th>
                      <th className="table-th">Issues</th>
                      <th className="table-th">Última Modificação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects.map(project => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="table-td font-medium text-gray-900">
                          <Link to={`/projects/${project.id}`} className="hover:text-blue-600">
                            {project.name}
                          </Link>
                        </td>
                        <td className="table-td">{project.stats?.documents || 0}</td>
                        <td className="table-td">{project.stats?.issues || 0}</td>
                        <td className="table-td">
                          {new Date(project.lastModified).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Atividades Recentes */}
        <div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
            
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {activityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium text-gray-900">{activity.user}</span>{' '}
                      {activity.action} {activity.item} em{' '}
                      <span className="font-medium text-gray-900">{activity.project}</span>
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todas as atividades
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

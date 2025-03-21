import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  PlusCircle, Filter, Grid, List, Search, AlertTriangle, 
  CheckCircle, Clock, XCircle, Circle, MoreHorizontal,
  User, Calendar, Tag, ArrowUp, ArrowDown, MessageSquare
} from 'lucide-react';
import axios from 'axios';

const IssuesPage = () => {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');  // 'list' ou 'grid'
  const [statusFilter, setStatusFilter] = useState('all');  // 'all', 'open', 'in-progress', 'resolved', 'closed'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dados simulados para issues
  const sampleIssues = [
    {
      id: 'ISS-001',
      title: 'Conflito de tubulação com viga estrutural',
      description: 'Tubulação de água fria passa através de viga estrutural no pavimento tipo.',
      status: 'open',
      priority: 'high',
      assignee: 'Carlos Silva',
      createdBy: 'Ana Oliveira',
      createdAt: '2025-03-10T10:30:00',
      dueDate: '2025-03-25T18:00:00',
      tags: ['MEP', 'Estrutural', 'Conflito'],
      location: 'Pavimento 3, Eixo B-5',
      comments: 2
    },
    {
      id: 'ISS-002',
      title: 'Dimensões incorretas da escada de emergência',
      description: 'Escada de emergência não atende às normas de segurança. Largura insuficiente.',
      status: 'in-progress',
      priority: 'critical',
      assignee: 'Ricardo Mendes',
      createdBy: 'Patricia Santos',
      createdAt: '2025-03-12T14:15:00',
      dueDate: '2025-03-20T18:00:00',
      tags: ['Arquitetura', 'Segurança', 'Normas'],
      location: 'Escada Oeste',
      comments: 5
    },
    {
      id: 'ISS-003',
      title: 'Falta de ponto de energia para equip. HVAC',
      description: 'Equipamento de ar condicionado não possui ponto de energia previsto no projeto elétrico.',
      status: 'resolved',
      priority: 'medium',
      assignee: 'Patricia Santos',
      createdBy: 'Ricardo Mendes',
      createdAt: '2025-03-05T09:45:00',
      dueDate: '2025-03-15T18:00:00',
      tags: ['MEP', 'Elétrica', 'HVAC'],
      location: 'Cobertura, Ala Norte',
      comments: 3
    },
    {
      id: 'ISS-004',
      title: 'Especificação de revestimento incompatível',
      description: 'Revestimento cerâmico especificado não é adequado para área externa.',
      status: 'closed',
      priority: 'low',
      assignee: 'Ana Oliveira',
      createdBy: 'Carlos Silva',
      createdAt: '2025-02-28T11:20:00',
      dueDate: '2025-03-10T18:00:00',
      tags: ['Arquitetura', 'Especificação', 'Material'],
      location: 'Terraço, Pavimento 10',
      comments: 1
    },
    {
      id: 'ISS-005',
      title: 'Altura do pé-direito em desacordo com memorial',
      description: 'Pé-direito do pavimento térreo está com 2.80m no modelo BIM, mas o memorial descritivo especifica 3.00m.',
      status: 'open',
      priority: 'high',
      assignee: 'Ricardo Mendes',
      createdBy: 'Ana Oliveira',
      createdAt: '2025-03-15T16:30:00',
      dueDate: '2025-03-28T18:00:00',
      tags: ['Arquitetura', 'BIM', 'Memorial'],
      location: 'Pavimento Térreo',
      comments: 0
    }
  ];
  
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        
        // Em uma aplicação real, substituiria por:
        // const response = await axios.get(`/api/projects/${projectId}/issues`);
        // setIssues(response.data);
        
        // Simulação de chamada de API
        setTimeout(() => {
          setIssues(sampleIssues);
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Erro ao carregar issues:', error);
        setError('Falha ao carregar issues. Verifique se o servidor está rodando.');
        setLoading(false);
      }
    };
    
    fetchIssues();
  }, [projectId]);
  
  // Aplicar filtros
  const filteredIssues = issues.filter(issue => {
    // Filtrar por status
    if (statusFilter !== 'all' && issue.status !== statusFilter) {
      return false;
    }
    
    // Filtrar por texto de pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.id.toLowerCase().includes(query) ||
        issue.assignee.toLowerCase().includes(query) ||
        issue.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Estatísticas por status
  const statusCounts = {
    all: issues.length,
    open: issues.filter(issue => issue.status === 'open').length,
    'in-progress': issues.filter(issue => issue.status === 'in-progress').length,
    resolved: issues.filter(issue => issue.status === 'resolved').length,
    closed: issues.filter(issue => issue.status === 'closed').length
  };
  
  // Cores para prioridades
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };
  
  // Ícones para status
  const statusIcons = {
    'open': <Circle className="text-blue-500" size={18} />,
    'in-progress': <Clock className="text-yellow-500" size={18} />,
    'resolved': <CheckCircle className="text-green-500" size={18} />,
    'closed': <XCircle className="text-gray-500" size={18} />
  };
  
  // Título para status
  const statusTitles = {
    'all': 'Todos',
    'open': 'Em Aberto',
    'in-progress': 'Em Andamento',
    'resolved': 'Resolvidos',
    'closed': 'Fechados'
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Issues</h2>
        
        <button className="btn btn-primary flex items-center">
          <PlusCircle size={16} className="mr-1" />
          <span>Novo Issue</span>
        </button>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        <div 
          className={`card cursor-pointer ${statusFilter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          <h3 className="text-sm font-medium text-gray-500">Todos os Issues</h3>
          <p className="mt-2 text-2xl font-bold">{statusCounts.all}</p>
        </div>
        
        <div 
          className={`card cursor-pointer ${statusFilter === 'open' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('open')}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Em Aberto</h3>
            <Circle className="text-blue-500" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold">{statusCounts.open}</p>
        </div>
        
        <div 
          className={`card cursor-pointer ${statusFilter === 'in-progress' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('in-progress')}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Em Andamento</h3>
            <Clock className="text-yellow-500" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold">{statusCounts['in-progress']}</p>
        </div>
        
        <div 
          className={`card cursor-pointer ${statusFilter === 'resolved' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('resolved')}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Resolvidos</h3>
            <CheckCircle className="text-green-500" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold">{statusCounts.resolved}</p>
        </div>
        
        <div 
          className={`card cursor-pointer ${statusFilter === 'closed' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('closed')}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Fechados</h3>
            <XCircle className="text-gray-500" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold">{statusCounts.closed}</p>
        </div>
      </div>
      
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <div className="text-lg font-medium mr-2">
              Issues {statusFilter !== 'all' ? statusTitles[statusFilter] : ''}
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredIssues.length} resultado{filteredIssues.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Pesquisar issues..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Filter size={20} className="text-gray-600" />
            </button>
            
            <button 
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('list')}
              title="Visualização em lista"
            >
              <List size={20} className="text-gray-600" />
            </button>
            
            <button 
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('grid')}
              title="Visualização em grade"
            >
              <Grid size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Carregando issues...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum issue encontrado para os filtros selecionados.</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-th">ID</th>
                  <th className="table-th">Título</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Prioridade</th>
                  <th className="table-th">Responsável</th>
                  <th className="table-th">Prazo</th>
                  <th className="table-th">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIssues.map(issue => (
                  <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="table-td font-mono">{issue.id}</td>
                    <td className="table-td font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span className="truncate max-w-xs">{issue.title}</span>
                        {issue.comments > 0 && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <MessageSquare size={12} className="mr-1" />
                            {issue.comments} comentário{issue.comments !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center">
                        {statusIcons[issue.status]}
                        <span className="ml-1.5">{statusTitles[issue.status]}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
                        {issue.priority === 'high' || issue.priority === 'critical' ? (
                          <ArrowUp size={12} className="mr-1" />
                        ) : (
                          <ArrowDown size={12} className="mr-1" />
                        )}
                        {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 mr-2">
                          {issue.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{issue.assignee}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      {new Date(issue.dueDate).toLocaleDateString()}
                    </td>
                    <td className="table-td">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <MoreHorizontal size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.map(issue => (
              <div key={issue.id} className="border rounded-lg hover:shadow-md transition-shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                    {issue.id}
                  </span>
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
                    {issue.priority === 'high' || issue.priority === 'critical' ? (
                      <ArrowUp size={12} className="mr-1" />
                    ) : (
                      <ArrowDown size={12} className="mr-1" />
                    )}
                    {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                  </span>
                </div>
                
                <h3 className="text-md font-medium mb-2">{issue.title}</h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {issue.description}
                </p>
                
                <div className="flex items-center mb-2">
                  {statusIcons[issue.status]}
                  <span className="ml-1.5 text-sm">{statusTitles[issue.status]}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {issue.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="border-t pt-3 flex justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <User size={12} className="mr-1" />
                    {issue.assignee}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={12} className="mr-1" />
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </div>
                  
                  {issue.comments > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <MessageSquare size={12} className="mr-1" />
                      {issue.comments}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesPage;

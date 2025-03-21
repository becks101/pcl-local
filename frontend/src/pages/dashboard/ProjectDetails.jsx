import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, FolderOpen, AlertCircle, Calendar, 
  ArrowUpRight, ArrowRight, Clock, Users, Info, Layers
} from 'lucide-react';
import axios from 'axios';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/projects/${projectId}`);
        setProject(response.data);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
        setError('Falha ao carregar os detalhes do projeto.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);
  
  if (loading) {
    return (
      <div className="container mx-auto text-center py-8">
        <p>Carregando detalhes do projeto...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto text-center py-8">
        <p className="text-red-500">{error}</p>
        <Link to="/" className="btn btn-primary mt-4">Voltar ao Dashboard</Link>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container mx-auto text-center py-8">
        <p>Projeto não encontrado</p>
        <Link to="/" className="btn btn-primary mt-4">Voltar ao Dashboard</Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h2>
        <p className="text-gray-600">{project.description || 'Sem descrição disponível'}</p>
      </div>
      
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Documentos</p>
            <h3 className="text-xl font-bold">{project.stats?.documents || 0}</h3>
          </div>
        </div>
        
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Modelos BIM</p>
            <h3 className="text-xl font-bold">{project.stats?.models || 0}</h3>
          </div>
        </div>
        
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-600 mr-4">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Issues</p>
            <h3 className="text-xl font-bold">{project.stats?.issues || 0}</h3>
          </div>
        </div>
        
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
            <FolderOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Desenhos</p>
            <h3 className="text-xl font-bold">{project.stats?.drawings || 0}</h3>
          </div>
        </div>
      </div>
      
      {/* Project Info and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Equipe do Projeto</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full p-2 mr-3">
                  <Users size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Gerente do Projeto</p>
                  <p className="text-sm text-gray-500">{project.manager || 'Não atribuído'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full p-2 mr-3">
                  <Users size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Coordenador BIM</p>
                  <p className="text-sm text-gray-500">{project.bimCoordinator || 'Não atribuído'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full p-2 mr-3">
                  <Users size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Arquiteto Responsável</p>
                  <p className="text-sm text-gray-500">{project.architect || 'Não atribuído'}</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver equipe completa
            </button>
          </div>
            <h3 className="text-lg font-semibold mb-4">Informações do Projeto</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Data de Criação</p>
                  <p className="font-medium">{new Date(project.created).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Última Modificação</p>
                  <p className="font-medium">{new Date(project.lastModified).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ativo
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Equipe</p>
                  <p className="font-medium">{project.team || 'Não definido'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Localização</p>
                <p className="font-medium">{project.location || 'Não definido'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Observações</p>
                <p>{project.notes || 'Sem observações adicionais'}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Acesso Rápido</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to={`/projects/${projectId}/documents`} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Documentos</h4>
                  <p className="text-sm text-gray-500">Gerenciar documentos do projeto</p>
                </div>
                <ArrowRight className="text-gray-400" size={18} />
              </Link>
              
              <Link to={`/projects/${projectId}/models`} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                  <Layers size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Modelos BIM</h4>
                  <p className="text-sm text-gray-500">Visualizar modelos 3D</p>
                </div>
                <ArrowRight className="text-gray-400" size={18} />
              </Link>
              
              <Link to={`/projects/${projectId}/issues`} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600 mr-3">
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Issues</h4>
                  <p className="text-sm text-gray-500">Gerenciar problemas e pendências</p>
                </div>
                <ArrowRight className="text-gray-400" size={18} />
              </Link>
              
              <Link to={`/projects/${projectId}/schedule`} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Cronograma</h4>
                  <p className="text-sm text-gray-500">Visualizar e gerenciar prazos</p>
                </div>
                <ArrowRight className="text-gray-400" size={18} />
              </Link>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <FileText size={16} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Carlos Silva</span>{' '}
                    adicionou um novo documento na pasta{' '}
                    <span className="font-medium text-gray-900">Especificações</span>
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    2h atrás
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <Layers size={16} className="text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Ana Oliveira</span>{' '}
                    atualizou o{' '}
                    <span className="font-medium text-gray-900">Modelo Estrutural</span>
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    3h atrás
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <AlertCircle size={16} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Ricardo Mendes</span>{' '}
                    resolveu{' '}
                    <span className="font-medium text-gray-900">Issue #42</span>
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    5h atrás
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <Calendar size={16} className="text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Patricia Santos</span>{' '}
                    atualizou o{' '}
                    <span className="font-medium text-gray-900">cronograma</span>
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    1d atrás
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todas as atividades
              </button>
            </div>
          </div>
          <div className="card mb-6">
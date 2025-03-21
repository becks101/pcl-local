import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Search, Bell, User, Menu } from 'lucide-react';
import axios from 'axios';

const Header = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  
  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        try {
          const response = await axios.get(`/api/projects/${projectId}`);
          setProject(response.data);
        } catch (error) {
          console.error('Erro ao carregar projeto:', error);
        }
      }
    };
    
    fetchProject();
  }, [projectId]);
  
  useEffect(() => {
    // Atualizar o título da página com base na rota atual
    const path = location.pathname;
    
    if (path === '/') {
      setPageTitle('Dashboard');
    } else if (path.includes('/documents')) {
      setPageTitle('Gerenciamento de Documentos');
    } else if (path.includes('/models')) {
      setPageTitle('Visualizador de Modelos 3D');
    } else if (path.includes('/issues')) {
      setPageTitle('Gestão de Issues');
    } else if (path.includes('/schedule')) {
      setPageTitle('Cronograma');
    } else if (path.includes('/projects/') && !path.includes('/', path.indexOf('/projects/') + 10)) {
      setPageTitle('Detalhes do Projeto');
    }
  }, [location.pathname]);
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button className="lg:hidden mr-2">
            <Menu className="header-icon" />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800">
            {project ? `${pageTitle} - ${project.name}` : pageTitle}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <button className="relative p-1 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100">
            <Bell className="header-icon" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 rounded-full p-1.5">
              <User className="header-icon text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Usuário</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

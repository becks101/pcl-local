import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Home, FileText, Box, AlertTriangle, Calendar, Settings, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Sidebar = () => {
  const location = useLocation();
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      };
    
    fetchProjects();
  }, [projectId]);
  
  // Atualizar o projeto selecionado quando o ID do projeto mudar
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [projectId, projects]);
  
  const isActive = (path) => {
    if (!projectId) return false;
    return location.pathname.includes(path);
  };
  
  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">PCL Local</h1>
        <p className="text-sm text-gray-400">Gerenciamento de Projetos</p>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <nav className="mt-5">
          <Link to="/" className="flex items-center px-4 py-2 hover:bg-gray-700 text-gray-300">
            <Home className="sidebar-icon" />
            <span>Dashboard</span>
          </Link>
          
          <div className="px-4 py-2 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-400 uppercase">Projetos</h2>
              <button 
                onClick={() => setExpanded(!expanded)}
                className="text-gray-400 hover:text-white"
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>
          
          {expanded && (
            <div className="mt-1 ml-4">
              {projects.map(project => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className={`flex items-center px-4 py-2 text-sm 
                    ${selectedProject?.id === project.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="truncate">{project.name}</span>
                </Link>
              ))}
            </div>
          )}
          
          {selectedProject && (
            <>
              <div className="px-4 py-2 mt-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase">
                  {selectedProject.name}
                </h2>
              </div>
              
              <Link
                to={`/projects/${selectedProject.id}/documents`}
                className={`flex items-center px-4 py-2 text-sm ${isActive('/documents') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <FileText className="sidebar-icon" />
                <span>Documentos</span>
              </Link>
              
              <Link
                to={`/projects/${selectedProject.id}/models`}
                className={`flex items-center px-4 py-2 text-sm ${isActive('/models') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <Box className="sidebar-icon" />
                <span>Modelos 3D</span>
              </Link>
              
              <Link
                to={`/projects/${selectedProject.id}/issues`}
                className={`flex items-center px-4 py-2 text-sm ${isActive('/issues') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <AlertTriangle className="sidebar-icon" />
                <span>Issues</span>
              </Link>
              
              <Link
                to={`/projects/${selectedProject.id}/schedule`}
                className={`flex items-center px-4 py-2 text-sm ${isActive('/schedule') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <Calendar className="sidebar-icon" />
                <span>Cronograma</span>
              </Link>
            </>
          )}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <Link to="/settings" className="flex items-center text-gray-300 hover:text-white">
          <Settings className="sidebar-icon" />
          <span>Configurações</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; catch (error) {
        console.error('Erro ao carregar projetos:', error);
      }
    
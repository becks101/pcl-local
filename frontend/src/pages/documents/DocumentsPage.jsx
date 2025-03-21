import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  FolderPlus, Upload, Filter, Grid, List, ChevronRight, 
  File, Folder, Eye, Download, MoreVertical, Search
} from 'lucide-react';
import axios from 'axios';

const DocumentsPage = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [currentPath, setCurrentPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Determinar o caminho atual com base na URL
  useEffect(() => {
    const path = location.pathname.split(`/projects/${projectId}/documents/`)[1] || '';
    setCurrentPath(path);
  }, [location.pathname, projectId]);

  // Carregar documentos
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/projects/${projectId}/documents`);
        setDocuments(response.data);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setError('Falha ao carregar documentos. Verifique se o servidor está rodando.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [projectId]);

  // Filtrar documentos pelo caminho atual
  const filteredDocuments = documents.filter(item => {
    // Lógica para filtrar documentos pelo caminho atual
    // Se estiver na raiz, mostrar apenas documentos e pastas da raiz
    if (!currentPath) {
      return !item.path.includes('/') || item.path.split('/').length === 1;
    }
    
    // Caso contrário, mostrar itens dentro da pasta atual
    const regex = new RegExp(`^${currentPath}/[^/]+$`);
    return regex.test(item.path);
  });

  // Filtrar também pelo termo de pesquisa
  const searchFilteredDocuments = searchQuery
    ? filteredDocuments.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredDocuments;

  // Navegar para uma pasta
  const navigateToFolder = (folderPath) => {
    navigate(`/projects/${projectId}/documents/${folderPath}`);
  };

  // Visualizar um arquivo
  const viewFile = (filePath) => {
    window.open(`/api/file/${projectId}/${filePath}`, '_blank');
  };

  // Baixar um arquivo
  const downloadFile = (filePath) => {
    window.open(`/api/file/${projectId}/${filePath}?download=true`, '_blank');
  };

  // Renderizar breadcrumbs
  const renderBreadcrumbs = () => {
    if (!currentPath) {
      return (
        <div className="flex items-center text-sm">
          <span className="font-medium">Documentos</span>
        </div>
      );
    }

    const parts = currentPath.split('/');
    
    return (
      <div className="flex items-center text-sm">
        <span 
          className="font-medium cursor-pointer hover:text-blue-600"
          onClick={() => navigate(`/projects/${projectId}/documents`)}
        >
          Documentos
        </span>
        
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <ChevronRight size={14} className="mx-1 text-gray-400" />
            {index === parts.length - 1 ? (
              <span className="font-medium">{part}</span>
            ) : (
              <span 
                className="font-medium cursor-pointer hover:text-blue-600"
                onClick={() => navigateToFolder(parts.slice(0, index + 1).join('/'))}
              >
                {part}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Renderizar visualização em grade
  const renderGridView = () => {
    return (
      <div className="file-grid">
        {searchFilteredDocuments.map((item, index) => (
          <div 
            key={index} 
            className="file-card cursor-pointer"
            onClick={() => item.isDirectory ? navigateToFolder(item.path) : viewFile(item.path)}
          >
            <div className="flex justify-center mb-2">
              {item.isDirectory ? (
                <Folder className="file-icon text-amber-500" />
              ) : (
                <File className="file-icon text-blue-500" />
              )}
            </div>
            
            <div className="text-center">
              <h4 className="font-medium text-sm truncate" title={item.name}>
                {item.name}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {item.isDirectory ? 'Pasta' : `${item.type.toUpperCase()} ${formatFileSize(item.size)}`}
              </p>
            </div>
            
            {!item.isDirectory && (
              <div className="flex justify-center mt-2 space-x-2">
                <button 
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={(e) => { e.stopPropagation(); viewFile(item.path); }}
                  title="Visualizar"
                >
                  <Eye size={16} className="text-gray-600" />
                </button>
                
                <button 
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={(e) => { e.stopPropagation(); downloadFile(item.path); }}
                  title="Baixar"
                >
                  <Download size={16} className="text-gray-600" />
                </button>
                
                <button 
                  className="p-1 rounded-full hover:bg-gray-100"
                  title="Mais opções"
                >
                  <MoreVertical size={16} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Renderizar visualização em lista
  const renderListView = () => {
    return (
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-th">Nome</th>
              <th className="table-th">Tipo</th>
              <th className="table-th">Tamanho</th>
              <th className="table-th">Modificado</th>
              <th className="table-th">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {searchFilteredDocuments.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="table-td font-medium text-gray-900">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => item.isDirectory ? navigateToFolder(item.path) : viewFile(item.path)}
                  >
                    {item.isDirectory ? (
                      <Folder size={20} className="mr-2 text-amber-500" />
                    ) : (
                      <File size={20} className="mr-2 text-blue-500" />
                    )}
                    <span className="truncate max-w-xs" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="table-td">
                  {item.isDirectory ? 'Pasta' : item.type.toUpperCase()}
                </td>
                <td className="table-td">
                  {item.isDirectory ? '-' : formatFileSize(item.size)}
                </td>
                <td className="table-td">
                  {new Date(item.modified).toLocaleDateString()}
                </td>
                <td className="table-td">
                  <div className="flex space-x-2">
                    {!item.isDirectory && (
                      <>
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => viewFile(item.path)}
                          title="Visualizar"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </button>
                        
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => downloadFile(item.path)}
                          title="Baixar"
                        >
                          <Download size={16} className="text-gray-600" />
                        </button>
                      </>
                    )}
                    
                    <button 
                      className="p-1 rounded-full hover:bg-gray-100"
                      title="Mais opções"
                    >
                      <MoreVertical size={16} className="text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Função auxiliar para formatar o tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            {renderBreadcrumbs()}
          </div>
          
          <div className="flex space-x-2">
            <button className="btn btn-primary flex items-center">
              <Upload size={16} className="mr-1" />
              <span>Upload</span>
            </button>
            
            <button className="btn btn-secondary flex items-center">
              <FolderPlus size={16} className="mr-1" />
              <span>Nova Pasta</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Pesquisar documentos..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('list')}
              title="Visualização em lista"
            >
              <List size={18} className="text-gray-600" />
            </button>
            
            <button 
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('grid')}
              title="Visualização em grade"
            >
              <Grid size={18} className="text-gray-600" />
            </button>
            
            <button 
              className="p-2 rounded-md hover:bg-gray-100"
              title="Filtrar"
            >
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Carregando documentos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : searchFilteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum documento encontrado {searchQuery ? 'para sua pesquisa' : 'nesta pasta'}.</p>
          </div>
        ) : (
          viewMode === 'grid' ? renderGridView() : renderListView()
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Listar todos os projetos
router.get('/', (req, res) => {
  try {
    const projectsRoot = req.app.locals.projectsRoot;
    const projects = [];

    // Ler os diretórios de projetos
    const projectDirs = fs.readdirSync(projectsRoot);
    
    for (const projectDir of projectDirs) {
      const projectPath = path.join(projectsRoot, projectDir);
      const stats = fs.statSync(projectPath);
      
      if (stats.isDirectory()) {
        let metadata = {};
        const metadataPath = path.join(projectPath, 'metadata.json');
        
        // Tentar ler o arquivo de metadados, se existir
        if (fs.existsSync(metadataPath)) {
          const metadataContent = fs.readFileSync(metadataPath, 'utf8');
          metadata = JSON.parse(metadataContent);
        }
        
        projects.push({
          id: projectDir,
          name: metadata.name || projectDir,
          description: metadata.description || '',
          created: metadata.created || stats.birthtime,
          lastModified: metadata.lastModified || stats.mtime,
          ...metadata
        });
      }
    }
    
    res.json(projects);
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    res.status(500).json({ error: 'Falha ao listar projetos', details: error.message });
  }
});

// Obter detalhes de um projeto específico
router.get('/:projectId', (req, res) => {
  try {
    const projectsRoot = req.app.locals.projectsRoot;
    const projectId = req.params.projectId;
    const projectPath = path.join(projectsRoot, projectId);
    
    if (!fs.existsSync(projectPath)) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    
    let metadata = {};
    const metadataPath = path.join(projectPath, 'metadata.json');
    
    if (fs.existsSync(metadataPath)) {
      const metadataContent = fs.readFileSync(metadataPath, 'utf8');
      metadata = JSON.parse(metadataContent);
    }
    
    const stats = fs.statSync(projectPath);
    
    // Contar arquivos em cada categoria
    const documentsCount = countFilesInDir(path.join(projectPath, 'documents'));
    const modelsCount = countFilesInDir(path.join(projectPath, 'models'));
    const drawingsCount = countFilesInDir(path.join(projectPath, 'drawings'));
    const issuesCount = countFilesInDir(path.join(projectPath, 'issues'));
    
    const project = {
      id: projectId,
      name: metadata.name || projectId,
      description: metadata.description || '',
      created: metadata.created || stats.birthtime,
      lastModified: metadata.lastModified || stats.mtime,
      stats: {
        documents: documentsCount,
        models: modelsCount,
        drawings: drawingsCount,
        issues: issuesCount
      },
      ...metadata
    };
    
    res.json(project);
  } catch (error) {
    console.error(`Erro ao obter detalhes do projeto ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Falha ao obter detalhes do projeto', details: error.message });
  }
});

// Listar documentos de um projeto
router.get('/:projectId/documents', (req, res) => {
  try {
    const projectsRoot = req.app.locals.projectsRoot;
    const projectId = req.params.projectId;
    const documentsPath = path.join(projectsRoot, projectId, 'documents');
    
    if (!fs.existsSync(documentsPath)) {
      return res.status(404).json({ error: 'Diretório de documentos não encontrado' });
    }
    
    const files = listFilesRecursively(documentsPath);
    res.json(files);
  } catch (error) {
    console.error(`Erro ao listar documentos do projeto ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Falha ao listar documentos', details: error.message });
  }
});

// Listar modelos BIM de um projeto
router.get('/:projectId/models', (req, res) => {
  try {
    const projectsRoot = req.app.locals.projectsRoot;
    const projectId = req.params.projectId;
    const modelsPath = path.join(projectsRoot, projectId, 'models');
    
    if (!fs.existsSync(modelsPath)) {
      return res.status(404).json({ error: 'Diretório de modelos não encontrado' });
    }
    
    const files = listFilesRecursively(modelsPath);
    res.json(files);
  } catch (error) {
    console.error(`Erro ao listar modelos do projeto ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Falha ao listar modelos', details: error.message });
  }
});

// Listar desenhos de um projeto
router.get('/:projectId/drawings', (req, res) => {
  try {
    const projectsRoot = req.app.locals.projectsRoot;
    const projectId = req.params.projectId;
    const drawingsPath = path.join(projectsRoot, projectId, 'drawings');
    
    if (!fs.existsSync(drawingsPath)) {
      return res.status(404).json({ error: 'Diretório de desenhos não encontrado' });
    }
    
    const files = listFilesRecursively(drawingsPath);
    res.json(files);
  } catch (error) {
    console.error(`Erro ao listar desenhos do projeto ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Falha ao listar desenhos', details: error.message });
  }
});

// Listar issues de um projeto
router.get('/:projectId/issues', (req, res) => {
  try {
    const projectsRoot = req.app.locals.projectsRoot;
    const projectId = req.params.projectId;
    const issuesPath = path.join(projectsRoot, projectId, 'issues');
    
    if (!fs.existsSync(issuesPath)) {
      return res.status(404).json({ error: 'Diretório de issues não encontrado' });
    }
    
    // Verificar se há um arquivo JSON de issues
    const issuesJsonPath = path.join(issuesPath, 'issues.json');
    if (fs.existsSync(issuesJsonPath)) {
      const issuesContent = fs.readFileSync(issuesJsonPath, 'utf8');
      const issues = JSON.parse(issuesContent);
      return res.json(issues);
    }
    
    // Se não houver arquivo JSON, listar arquivos na pasta
    const files = listFilesRecursively(issuesPath);
    res.json(files);
  } catch (error) {
    console.error(`Erro ao listar issues do projeto ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Falha ao listar issues', details: error.message });
  }
});

// Funções auxiliares
function countFilesInDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return 0;
  }
  
  let count = 0;
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isFile()) {
      count++;
    } else if (stats.isDirectory()) {
      count += countFilesInDir(itemPath);
    }
  }
  
  return count;
}

function listFilesRecursively(dirPath, baseDir = dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  
  let files = [];
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    const relativePath = path.relative(baseDir, itemPath);
    
    if (stats.isFile()) {
      files.push({
        name: item,
        path: relativePath,
        type: path.extname(item).slice(1),
        size: stats.size,
        modified: stats.mtime,
        isDirectory: false
      });
    } else if (stats.isDirectory()) {
      files.push({
        name: item,
        path: relativePath,
        type: 'directory',
        modified: stats.mtime,
        isDirectory: true,
        children: listFilesRecursively(itemPath, baseDir)
      });
    }
  }
  
  return files;
}

module.exports = router;

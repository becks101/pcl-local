const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Acessar um arquivo específico
router.get('/:projectId/*', (req, res) => {
  try {
    const projectsRoot = req.app.locals.projectsRoot;
    const projectId = req.params.projectId;
    const filePath = req.params[0];
    const fullPath = path.join(projectsRoot, projectId, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    const stats = fs.statSync(fullPath);
    
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'O caminho especificado não é um arquivo' });
    }
    
    // Verificar se o cliente quer fazer download do arquivo
    const download = req.query.download === 'true';
    
    if (download) {
      return res.download(fullPath);
    }
    
    // Enviar arquivo para visualização
    const fileExt = path.extname(fullPath).toLowerCase();
    const fileName = path.basename(fullPath);
    
    // Definir tipo de conteúdo baseado na extensão
    let contentType = 'application/octet-stream';
    
    switch (fileExt) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      case '.html':
        contentType = 'text/html';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.xml':
        contentType = 'application/xml';
        break;
      // Outros tipos podem ser adicionados conforme necessário
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    
    // Streaming do arquivo
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error(`Erro ao acessar arquivo ${req.params[0]} do projeto ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Falha ao acessar arquivo', details: error.message });
  }
});

// Upload de arquivos
router.post('/:projectId/*', (req, res) => {
  // Implementação de upload de arquivo
  // Isso necessitaria de um middleware como o multer para processar
  // os arquivos de upload, que seria implementado em um código real
  
  res.status(501).json({ error: 'Funcionalidade de upload ainda não implementada' });
});

// Excluir um arquivo
router.delete('/:projectId/*', (req, res) => {
  try {
    const projectsRoot = req.app.locals.projectsRoot;
    const projectId = req.params.projectId;
    const filePath = req.params[0];
    const fullPath = path.join(projectsRoot, projectId, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    const stats = fs.statSync(fullPath);
    
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'O caminho especificado não é um arquivo' });
    }
    
    fs.unlinkSync(fullPath);
    res.status(200).json({ success: true, message: 'Arquivo excluído com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir arquivo ${req.params[0]} do projeto ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Falha ao excluir arquivo', details: error.message });
  }
});

// Criar um diretório
router.post('/directory/:projectId/*', (req, res) => {
  try {
    const projectsRoot = req.app.locals.projectsRoot;
    const projectId = req.params.projectId;
    const dirPath = req.params[0];
    const fullPath = path.join(projectsRoot, projectId, dirPath);
    
    if (fs.existsSync(fullPath)) {
      return res.status(409).json({ error: 'O diretório já existe' });
    }
    
    fs.mkdirSync(fullPath, { recursive: true });
    res.status(201).json({ success: true, message: 'Diretório criado com sucesso' });
  } catch (error) {
    console.error(`Erro ao criar diretório ${req.params[0]} no projeto ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Falha ao criar diretório', details: error.message });
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importar rotas
const projectRoutes = require('./routes/projectRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Diretório raiz dos projetos
const projectsRoot = path.join(__dirname, '../pcl-data/projects');

// Configuração global para acessar a raiz dos projetos
app.locals.projectsRoot = projectsRoot;

// Rotas
app.use('/api/projects', projectRoutes);
app.use('/api/file', fileRoutes);

// Rota de teste
app.get('/api/status', (req, res) => {
  res.json({ status: 'PCL Local Server Running', version: '1.0.0' });
});

// Manipulação de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocorreu um erro no servidor', details: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`PCL Local Server rodando na porta ${PORT}`);
  console.log(`Gerenciando projetos em: ${projectsRoot}`);
});

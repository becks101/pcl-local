# Documentação do Sistema PCL Local

## Visão Geral do Sistema

O PCL (project construction local) Local é uma solução para gerenciar projetos de construção, incluindo documentos, modelos BIM, problemas e cronogramas, tudo isso a partir de uma estrutura de pastas no seu computador.

## Componentes Principais

O sistema é composto por duas partes fundamentais:
1. **Backend**: Um servidor Node.js que gerencia o acesso aos arquivos locais
2. **Frontend**: Uma aplicação React que fornece a interface de usuário

## Funcionalidades Detalhadas

### 1. Dashboard (PCL-dashboard)

**Descrição**: Página inicial que exibe uma visão geral dos projetos e atividades recentes.

**Funções**:
- Exibição de projetos recentes com estatísticas
- Visualização de atividades recentes no sistema
- Acesso rápido às principais ferramentas
- Resumo visual do progresso dos projetos

**Uso**:
- Navegue pelos projetos clicando em suas linhas na tabela
- Acesse funções rápidas pelos ícones de acesso rápido
- Visualize as atividades recentes para acompanhar o progresso

### 2. Gerenciamento de Documentos (PCL-documents)

**Descrição**: Módulo para visualizar, organizar e gerenciar todos os documentos relacionados aos projetos.

**Funções**:
- Navegação por pastas de documentos
- Visualização em grade ou lista dos arquivos
- Upload de novos documentos
- Criação de novas pastas
- Visualização de metadados de documentos (tamanho, tipo, data)
- Download de documentos

**Uso**:
- Alterne entre visualização em grade/lista usando os botões de alternância
- Faça upload de novos arquivos usando o botão "Upload"
- Crie novas pastas com o botão "Nova Pasta"
- Filtre documentos usando as opções de filtro
- Visualize documentos clicando no ícone de olho
- Baixe documentos com o botão de download

### 3. Visualizador de Modelos 3D (PCL-model-viewer)

**Descrição**: Interface para visualizar e interagir com modelos BIM e 3D.

**Funções**:
- Exibição de modelos 3D (suporte para arquivos .rvt, .dwg, .ifc)
- Navegação por diferentes visualizações (planta, 3D, corte)
- Controle de visibilidade de elementos do modelo
- Ferramentas de navegação 3D (zoom, rotação, pan)
- Seleção e propriedades de objetos

**Uso**:
- Alterne entre diferentes vistas usando o seletor de vistas
- Controle a visibilidade dos elementos usando as caixas de seleção
- Navegue pelo modelo usando os controles de zoom, rotação
- Expanda/recolha o painel lateral com o botão de alternância
- Selecione objetos para ver suas propriedades

### 4. Gestão de Issues (PCL-issues)

**Descrição**: Sistema para rastreamento e gerenciamento de problemas e questões do projeto.

**Funções**:
- Criação e atribuição de problemas
- Categorização por tipo, prioridade e status
- Acompanhamento de prazos
- Filtros e pesquisa de problemas
- Visualização em grade ou lista

**Uso**:
- Crie novos problemas com o botão "Novo Issue"
- Filtre problemas por status usando o seletor de status
- Alterne entre visualizações usando os botões de grade/lista
- Visualize estatísticas por status nos cards do topo
- Clique em um problema para ver detalhes completos

### 5. Cronograma (PCL-schedule)

**Descrição**: Ferramenta para visualização e gerenciamento do cronograma do projeto.

**Funções**:
- Visualização de Gantt para tarefas e marcos
- Gerenciamento de tarefas e subtarefas
- Acompanhamento de progresso
- Visualizações alternativas (calendário, quadro)
- Expansão/colapso de estrutura de tarefas

**Uso**:
- Alterne entre diferentes visualizações (Gantt, Calendário, Quadro)
- Expanda/recolha tarefas clicando nos ícones de seta
- Visualize o progresso das tarefas pelas barras de progresso
- Adicione novas tarefas com o botão "Add Task"
- Navegue pelos marcos do projeto na seção Milestones

## Backend e Sistema de Arquivos

### Servidor Local (PCL-local-adapter)

**Descrição**: Servidor Node.js que gerencia o acesso aos arquivos locais e fornece APIs para o frontend.

**Endpoints**:
- `/api/projects` - Lista todos os projetos
- `/api/projects/:projectId/documents` - Lista documentos de um projeto
- `/api/projects/:projectId/models` - Lista modelos BIM de um projeto
- `/api/projects/:projectId/drawings` - Lista pranchas e desenhos de um projeto
- `/api/file/:projectId/*` - Acesso direto a um arquivo específico

**Funções**:
- Varredura recursiva de diretórios
- Leitura de metadados de arquivos
- Servir arquivos para visualização/download
- Categorização automática de arquivos por extensão

## Estrutura de Arquivos

### Organização Recomendada

```
PCL-local/
│
├── projects/                     
│   ├── project1/                 
│   │   ├── metadata.json         # Informações do projeto
│   │   ├── documents/            # Documentos gerais
│   │   │   ├── specifications/   # Especificações técnicas
│   │   │   ├── contracts/        # Documentos contratuais
│   │   │   └── reports/          # Relatórios
│   │   │
│   │   ├── models/               # Modelos BIM
│   │   │   ├── architectural/    # Arquivos .rvt arquitetônicos
│   │   │   ├── structural/       # Arquivos .rvt estruturais
│   │   │   └── mep/              # Arquivos .rvt MEP
│   │   │
│   │   ├── drawings/             # Desenhos técnicos
│   │   │   ├── pdf/              # Pranchas em PDF
│   │   │   └── dwg/              # Pranchas em DWG
│   │   │
│   │   ├── issues/               # Registro de problemas
│   │   │   └── attachments/      # Anexos dos problemas
│   │   │
│   │   └── schedule/             # Arquivos do cronograma
```

## Requisitos do Sistema

### Para o Backend
- Node.js v14.0 ou superior
- Módulos: express, cors, path, fs

### Para o Frontend
- React 17.0 ou superior
- Dependências: lucide-react, react-router-dom, tailwindcss

## Considerações de Uso

1. **Performance**: O carregamento de arquivos grandes (como modelos BIM) pode ser lento dependendo do hardware
2. **Compatibilidade**: A visualização nativa de arquivos .rvt requer componentes adicionais (não incluídos)
3. **Backups**: Recomenda-se fazer backups regulares da pasta `projects` para evitar perda de dados
4. **Segurança**: O sistema é projetado para uso local e não possui autenticação robusta

## Extensibilidade

O sistema foi projetado para ser facilmente estendido com funcionalidades adicionais:

1. **Integração com Autodesk Forge**: Para visualização avançada de modelos 3D
2. **Sistema de comentários**: Para colaboração em documentos e modelos
3. **Integração com Git**: Para controle de versão avançado
4. **Sistema de notificações**: Para alertas sobre prazos e atualizações

## Solução de Problemas

### Erros Comuns

1. **Arquivos não aparecem**: Verifique a estrutura de pastas e permissões de acesso
2. **Servidor não inicia**: Confirme se as portas necessárias estão disponíveis (3001 para backend)
3. **Modelos 3D não carregam**: Os arquivos .rvt requerem conversores adicionais para visualização web
4. **Erros de CORS**: Verifique se o servidor está configurado para permitir acesso local

### Suporte

Para problemas com o sistema, verifique:
1. Se o servidor está rodando (`node server.js`)
2. Se a estrutura de pastas está correta
3. Se os arquivos metadata.json estão formatados corretamente
4. Se os tipos de arquivo estão nas pastas corretas

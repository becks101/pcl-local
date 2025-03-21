import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes principais
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Páginas
import Dashboard from './pages/dashboard/Dashboard';
import DocumentsPage from './pages/documents/DocumentsPage';
import ModelViewer from './pages/model-viewer/ModelViewer';
import IssuesPage from './pages/issues/IssuesPage';
import SchedulePage from './pages/schedule/SchedulePage';
import ProjectDetails from './pages/dashboard/ProjectDetails';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
              <Route path="/projects/:projectId/documents/*" element={<DocumentsPage />} />
              <Route path="/projects/:projectId/models/*" element={<ModelViewer />} />
              <Route path="/projects/:projectId/issues" element={<IssuesPage />} />
              <Route path="/projects/:projectId/schedule" element={<SchedulePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

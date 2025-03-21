import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, LayoutGrid, List, PlusCircle, 
  Filter, ChevronRight, ChevronDown, CheckSquare, 
  Clock, AlertCircle, Download, Share2
} from 'lucide-react';
import axios from 'axios';

const SchedulePage = () => {
  const { projectId } = useParams();
  const [viewMode, setViewMode] = useState('gantt'); // 'gantt', 'calendar', 'board'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState({});
  
  // Dados simulados para o cronograma
  const sampleTasks = [
    {
      id: 1,
      name: 'Fase de Projeto',
      startDate: '2025-01-15',
      endDate: '2025-03-30',
      progress: 80,
      children: [
        {
          id: 11,
          name: 'Anteprojeto Arquitetônico',
          startDate: '2025-01-15',
          endDate: '2025-02-15',
          progress: 75,
          status: 'in-progress'
        },
        {
          id: 14,
          name: 'Projetos Complementares',
          startDate: '2025-02-20',
          endDate: '2025-03-30',
          progress: 60,
          status: 'in-progress',
          children: [
            {
              id: 141,
              name: 'Projeto Hidráulico',
              startDate: '2025-02-20',
              endDate: '2025-03-15',
              progress: 70,
              status: 'in-progress'
            },
            {
              id: 142,
              name: 'Projeto Elétrico',
              startDate: '2025-02-25',
              endDate: '2025-03-20',
              progress: 65,
              status: 'in-progress'
            },
            {
              id: 143,
              name: 'Projeto HVAC',
              startDate: '2025-03-01',
              endDate: '2025-03-30',
              progress: 40,
              status: 'in-progress'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Aprovações e Licenciamentos',
      startDate: '2025-03-01',
      endDate: '2025-04-30',
      progress: 30,
      children: [
        {
          id: 21,
          name: 'Aprovação na Prefeitura',
          startDate: '2025-03-01',
          endDate: '2025-04-15',
          progress: 40,
          status: 'in-progress'
        },
        {
          id: 22,
          name: 'Aprovação Corpo de Bombeiros',
          startDate: '2025-03-15',
          endDate: '2025-04-30',
          progress: 20,
          status: 'in-progress'
        }
      ]
    },
    {
      id: 3,
      name: 'Fase de Construção',
      startDate: '2025-04-15',
      endDate: '2025-12-31',
      progress: 0,
      status: 'not-started',
      children: [
        {
          id: 31,
          name: 'Fundações',
          startDate: '2025-04-15',
          endDate: '2025-06-15',
          progress: 0,
          status: 'not-started'
        },
        {
          id: 32,
          name: 'Estrutura',
          startDate: '2025-06-01',
          endDate: '2025-09-30',
          progress: 0,
          status: 'not-started'
        },
        {
          id: 33,
          name: 'Vedações e Alvenarias',
          startDate: '2025-07-15',
          endDate: '2025-10-30',
          progress: 0,
          status: 'not-started'
        },
        {
          id: 34,
          name: 'Instalações',
          startDate: '2025-08-15',
          endDate: '2025-11-30',
          progress: 0,
          status: 'not-started'
        },
        {
          id: 35,
          name: 'Acabamentos',
          startDate: '2025-10-01',
          endDate: '2025-12-31',
          progress: 0,
          status: 'not-started'
        }
      ]
    }
  ]; 100,
          status: 'completed'
        },
        {
          id: 12,
          name: 'Projeto Executivo Arquitetônico',
          startDate: '2025-02-01',
          endDate: '2025-03-15',
          progress: 85,
          status: 'in-progress'
        },
        {
          id: 13,
          name: 'Projeto Estrutural',
          startDate: '2025-02-15',
          endDate: '2025-03-20',
          progress:
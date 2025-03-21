import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Eye, EyeOff, Maximize, Minimize, Layers, 
  RotateCcw, ZoomIn, Grid3X3, Layout, ChevronLeft, ChevronRight,
  FileText, Settings, Download, Share2
} from 'lucide-react';
import axios from 'axios';
import * as THREE from 'three';

const ModelViewer = () => {
  const { projectId } = useParams();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('3D'); // '3D', 'PLAN', 'SECTION'
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  
  // Elementos do modelo (simulação)
  const [elements, setElements] = useState([
    { id: 1, name: 'Estrutural', visible: true, children: [
      { id: 11, name: 'Pilares', visible: true },
      { id: 12, name: 'Vigas', visible: true },
      { id: 13, name: 'Lajes', visible: true }
    ]},
    { id: 2, name: 'Arquitetônico', visible: true, children: [
      { id: 21, name: 'Paredes', visible: true },
      { id: 22, name: 'Portas', visible: true },
      { id: 23, name: 'Janelas', visible: true },
      { id: 24, name: 'Mobiliário', visible: true }
    ]},
    { id: 3, name: 'MEP', visible: true, children: [
      { id: 31, name: 'HVAC', visible: true },
      { id: 32, name: 'Elétrica', visible: true },
      { id: 33, name: 'Hidráulica', visible: true }
    ]}
  ]);
  
  // Buscar modelos disponíveis
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/projects/${projectId}/models`);
        setModels(response.data);
        
        // Selecionar o primeiro modelo por padrão
        if (response.data.length > 0) {
          setSelectedModel(response.data[0]);
        }
        
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        setError('Falha ao carregar modelos. Verifique se o servidor está rodando.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [projectId]);
  
  // Inicializar o visualizador 3D quando um modelo é selecionado
  useEffect(() => {
    if (!selectedModel || !canvasRef.current) return;
    
    // Inicializar a cena
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Adicionar iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);
    
    // Adicionar grade
    const gridHelper = new THREE.GridHelper(50, 50);
    scene.add(gridHelper);
    
    // Configurar câmera
    const camera = new THREE.PerspectiveCamera(
      75, 
      canvas.clientWidth / canvas.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Configurar renderizador
    const renderer = new THREE.WebGLRenderer({ 
      canvas,
      antialias: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    rendererRef.current = renderer;
    
    // Adicionar controles
    // Nota: Em uma implementação real, você importaria OrbitControls do three.js
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controlsRef.current = controls;
    
    // Adicionar forma de amostra (em uma implementação real, você carregaria o modelo)
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshStandardMaterial({ color: 0x049ef4 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Função de animação
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Girar o cubo para efeito de demonstração
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      
      // Atualizar controles
      // if (controlsRef.current) {
      //   controlsRef.current.update();
      // }
      
      // Renderizar a cena
      renderer.render(scene, camera);
    };
    
    // Iniciar animação
    animate();
    
    // Ajustar tamanho quando a janela for redimensionada
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
      
      if (rendererRef.current) {
        rendererRef.current.setSize(width, height, false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Limpeza
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Limpar a cena e liberar recursos
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [selectedModel]);
  
  // Alternar visibilidade de um elemento
  const toggleElementVisibility = (elementId) => {
    setElements(prevElements => {
      return prevElements.map(element => {
        if (element.id === elementId) {
          // Alternar o elemento principal
          return { 
            ...element, 
            visible: !element.visible,
            // Se o elemento principal ficar invisível, todos os filhos também ficam
            children: element.children?.map(child => ({ ...child, visible: !element.visible ? false : child.visible }))
          };
        } else if (element.children) {
          // Verificar filhos
          return {
            ...element,
            children: element.children.map(child => {
              if (child.id === elementId) {
                return { ...child, visible: !child.visible };
              }
              return child;
            })
          };
        }
        return element;
      });
    });
    
    // Aqui você atualizaria a visibilidade no modelo 3D real
  };
  
  return (
    <div className="flex h-full">
      {/* Sidebar de navegação e controle */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Navegador de Modelos</h3>
          
          <select 
            className="w-full input"
            value={selectedModel?.path || ''}
            onChange={(e) => {
              const modelPath = e.target.value;
              const model = models.find(m => m.path === modelPath);
              if (model) setSelectedModel(model);
            }}
          >
            {models.map((model, index) => (
              <option key={index} value={model.path}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium mb-2">Visualização</h4>
          
          <div className="flex space-x-1 mb-4">
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded ${viewMode === '3D' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setViewMode('3D')}
            >
              3D
            </button>
            
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded ${viewMode === 'PLAN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setViewMode('PLAN')}
            >
              Planta
            </button>
            
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded ${viewMode === 'SECTION' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setViewMode('SECTION')}
            >
              Corte
            </button>
          </div>
          
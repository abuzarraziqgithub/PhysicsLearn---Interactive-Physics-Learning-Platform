import React, { useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import DrawingCanvas from './components/DrawingCanvas';
import Viewport3D from './components/Viewport3D';
import PropertiesPanel from './components/PropertiesPanel';
import { DrawingProvider } from './hooks/useDrawingContext';

function App() {
  const [activeView, setActiveView] = useState('2d'); // '2d' or '3d'
  const [showProperties, setShowProperties] = useState(true);

  return (
    <DrawingProvider>
      <div className="app">
        <Header 
          activeView={activeView}
          setActiveView={setActiveView}
          showProperties={showProperties}
          setShowProperties={setShowProperties}
        />
        
        <div className="app-content">
          <Toolbar />
          
          <div className="main-workspace">
            {activeView === '2d' ? (
              <DrawingCanvas />
            ) : (
              <Viewport3D />
            )}
            
            {showProperties && (
              <PropertiesPanel />
            )}
          </div>
        </div>
      </div>
    </DrawingProvider>
  );
}

export default App;

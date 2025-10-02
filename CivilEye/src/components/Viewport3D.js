import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { useDrawing } from '../hooks/useDrawingContext';
import Building3D from './Building3D';
import './Viewport3D.css';

function Viewport3D() {
  const { objects, wallSettings } = useDrawing();
  const [isGenerating3D, setIsGenerating3D] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);

  // Convert 2D objects to 3D building
  const generate3DBuilding = () => {
    setIsGenerating3D(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsGenerating3D(false);
    }, 1000);
  };

  const handleExport3D = () => {
    // TODO: Implement 3D export functionality
    console.log('Exporting 3D model...');
  };

  return (
    <div className="viewport-3d">
      <div className="viewport-3d-controls">
        <div className="viewport-toolbar">
          <button 
            className="control-button"
            onClick={generate3DBuilding}
            disabled={isGenerating3D || objects.length === 0}
          >
            {isGenerating3D ? 'Generating...' : 'Generate 3D'}
          </button>
          
          <button 
            className="control-button"
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
          
          <button 
            className="control-button"
            onClick={() => setShowDimensions(!showDimensions)}
          >
            {showDimensions ? 'Hide Dimensions' : 'Show Dimensions'}
          </button>
          
          <button 
            className="control-button"
            onClick={handleExport3D}
          >
            Export 3D
          </button>
        </div>
        
        <div className="viewport-info">
          <span>Walls: {objects.filter(obj => obj.type === 'rectangle').length}</span>
          <span>Height: {wallSettings.height} ft</span>
          <span>Thickness: {wallSettings.thickness} in</span>
        </div>
      </div>
      
      <div className="canvas-3d">
        <Canvas
          camera={{ position: [50, 50, 50], fov: 50 }}
          style={{ background: '#f0f0f0' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {showGrid && (
            <Grid 
              position={[0, -0.1, 0]} 
              args={[100, 100]} 
              cellSize={1} 
              cellThickness={0.5} 
              cellColor="#888888" 
              sectionSize={10} 
              sectionThickness={1} 
              sectionColor="#444444" 
              fadeDistance={30} 
              fadeStrength={1} 
              followCamera={false} 
              infiniteGrid={true} 
            />
          )}
          
          {/* Render 3D building from 2D objects */}
          {objects.length > 0 && (
            <Building3D 
              objects={objects} 
              wallSettings={wallSettings}
              showDimensions={showDimensions}
            />
          )}
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
      
      {objects.length === 0 && (
        <div className="viewport-empty">
          <div className="empty-message">
            <h3>No 2D Drawing Found</h3>
            <p>Switch to 2D view to create your building plan</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Viewport3D;

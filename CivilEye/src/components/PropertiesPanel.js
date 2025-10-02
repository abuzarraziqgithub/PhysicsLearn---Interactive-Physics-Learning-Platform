import React, { useState } from 'react';
import { useDrawing } from '../hooks/useDrawingContext';
import './PropertiesPanel.css';

function PropertiesPanel() {
  const {
    activeTool,
    drawingSettings,
    measurementSettings,
    wallSettings,
    updateDrawingSettings,
    updateMeasurementSettings,
    updateWallSettings,
    selectedObjects,
    objects,
    showGrid,
    gridSize,
    snapToGrid,
    setGridSettings
  } = useDrawing();

  const [activeTab, setActiveTab] = useState('drawing');

  const selectedObject = selectedObjects.length === 1 
    ? objects.find(obj => obj.id === selectedObjects[0])
    : null;

  const tabs = [
    { id: 'drawing', label: 'Drawing', icon: '🎨' },
    { id: 'measurement', label: 'Units', icon: '📏' },
    { id: 'walls', label: '3D Walls', icon: '🏗️' },
    { id: 'grid', label: 'Grid', icon: '⊞' }
  ];

  return (
    <div className="properties-panel">
      <div className="properties-header">
        <div className="properties-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="properties-content">
        {activeTab === 'drawing' && (
          <DrawingProperties 
            settings={drawingSettings}
            onUpdate={updateDrawingSettings}
            selectedObject={selectedObject}
          />
        )}
        
        {activeTab === 'measurement' && (
          <MeasurementProperties 
            settings={measurementSettings}
            onUpdate={updateMeasurementSettings}
          />
        )}
        
        {activeTab === 'walls' && (
          <WallProperties 
            settings={wallSettings}
            onUpdate={updateWallSettings}
          />
        )}
        
        {activeTab === 'grid' && (
          <GridProperties 
            gridSize={gridSize}
            snapToGrid={snapToGrid}
            showGrid={showGrid}
            onUpdate={setGridSettings}
          />
        )}
      </div>
      
      {selectedObject && (
        <div className="object-properties">
          <h4>Selected Object</h4>
          <div className="property-item">
            <label>Type:</label>
            <span>{selectedObject.type}</span>
          </div>
          <div className="property-item">
            <label>ID:</label>
            <span>{selectedObject.id}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawingProperties({ settings, onUpdate, selectedObject }) {
  const handleChange = (property, value) => {
    onUpdate({ [property]: value });
  };

  return (
    <div className="property-group">
      <h4>Drawing Settings</h4>
      
      <div className="property-item">
        <label>Stroke Color:</label>
        <input
          type="color"
          value={settings.strokeColor}
          onChange={(e) => handleChange('strokeColor', e.target.value)}
        />
      </div>
      
      <div className="property-item">
        <label>Fill Color:</label>
        <input
          type="color"
          value={settings.fillColor}
          onChange={(e) => handleChange('fillColor', e.target.value)}
        />
      </div>
      
      <div className="property-item">
        <label>Stroke Width:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={settings.strokeWidth}
          onChange={(e) => handleChange('strokeWidth', parseInt(e.target.value))}
        />
        <span>{settings.strokeWidth}px</span>
      </div>
      
      <div className="property-item">
        <label>Opacity:</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={settings.opacity}
          onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
        />
        <span>{Math.round(settings.opacity * 100)}%</span>
      </div>
    </div>
  );
}

function MeasurementProperties({ settings, onUpdate }) {
  const handleChange = (property, value) => {
    onUpdate({ [property]: value });
  };

  return (
    <div className="property-group">
      <h4>Measurement Settings</h4>
      
      <div className="property-item">
        <label>Unit:</label>
        <select
          value={settings.unit}
          onChange={(e) => handleChange('unit', e.target.value)}
        >
          <option value="feet">Feet</option>
          <option value="meters">Meters</option>
          <option value="inches">Inches</option>
          <option value="centimeters">Centimeters</option>
        </select>
      </div>
      
      <div className="property-item">
        <label>Precision:</label>
        <input
          type="number"
          min="0"
          max="4"
          value={settings.precision}
          onChange={(e) => handleChange('precision', parseInt(e.target.value))}
        />
        <span>decimal places</span>
      </div>
    </div>
  );
}

function WallProperties({ settings, onUpdate }) {
  const handleChange = (property, value) => {
    onUpdate({ [property]: value });
  };

  return (
    <div className="property-group">
      <h4>3D Wall Settings</h4>
      
      <div className="property-item">
        <label>Height:</label>
        <input
          type="number"
          min="1"
          max="50"
          value={settings.height}
          onChange={(e) => handleChange('height', parseFloat(e.target.value))}
        />
        <span>feet</span>
      </div>
      
      <div className="property-item">
        <label>Thickness:</label>
        <input
          type="number"
          min="1"
          max="24"
          value={settings.thickness}
          onChange={(e) => handleChange('thickness', parseFloat(e.target.value))}
        />
        <span>inches</span>
      </div>
      
      <div className="property-item">
        <label>Material:</label>
        <select
          value={settings.material}
          onChange={(e) => handleChange('material', e.target.value)}
        >
          <option value="concrete">Concrete</option>
          <option value="brick">Brick</option>
          <option value="wood">Wood</option>
          <option value="steel">Steel</option>
          <option value="glass">Glass</option>
        </select>
      </div>
    </div>
  );
}

function GridProperties({ gridSize, snapToGrid, showGrid, onUpdate }) {
  const handleChange = (property, value) => {
    if (property === 'gridSize') {
      onUpdate(value, snapToGrid, showGrid);
    } else if (property === 'snapToGrid') {
      onUpdate(gridSize, value, showGrid);
    } else if (property === 'showGrid') {
      onUpdate(gridSize, snapToGrid, value);
    }
  };

  return (
    <div className="property-group">
      <h4>Grid Settings</h4>
      
      <div className="property-item">
        <label>Grid Size:</label>
        <input
          type="number"
          min="5"
          max="100"
          value={gridSize}
          onChange={(e) => handleChange('gridSize', parseInt(e.target.value))}
        />
        <span>pixels</span>
      </div>
      
      <div className="property-item">
        <label>Snap to Grid:</label>
        <input
          type="checkbox"
          checked={snapToGrid}
          onChange={(e) => handleChange('snapToGrid', e.target.checked)}
        />
      </div>
      
      <div className="property-item">
        <label>Show Grid:</label>
        <input
          type="checkbox"
          checked={showGrid}
          onChange={(e) => handleChange('showGrid', e.target.checked)}
        />
      </div>
    </div>
  );
}

export default PropertiesPanel;

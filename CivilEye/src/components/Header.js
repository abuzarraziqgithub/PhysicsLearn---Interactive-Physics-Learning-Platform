import React from 'react';
import './Header.css';

function Header({ activeView, setActiveView, showProperties, setShowProperties }) {
  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving project...');
  };

  const handleLoad = () => {
    // TODO: Implement load functionality
    console.log('Loading project...');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting project...');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>CivilEye</h1>
        <span className="header-subtitle">Residential CAD Tool</span>
      </div>
      
      <div className="header-center">
        <div className="view-toggle">
          <button 
            className={activeView === '2d' ? 'active' : ''}
            onClick={() => setActiveView('2d')}
          >
            2D Drawing
          </button>
          <button 
            className={activeView === '3d' ? 'active' : ''}
            onClick={() => setActiveView('3d')}
          >
            3D View
          </button>
        </div>
      </div>
      
      <div className="header-controls">
        <button 
          className="header-button"
          onClick={handleSave}
        >
          Save
        </button>
        <button 
          className="header-button"
          onClick={handleLoad}
        >
          Load
        </button>
        <button 
          className="header-button"
          onClick={handleExport}
        >
          Export
        </button>
        <button 
          className={`header-button ${showProperties ? 'active' : ''}`}
          onClick={() => setShowProperties(!showProperties)}
        >
          Properties
        </button>
      </div>
    </header>
  );
}

export default Header;

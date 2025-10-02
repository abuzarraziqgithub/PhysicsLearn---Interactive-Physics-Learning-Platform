import React from 'react';
import { useDrawing, DRAWING_TOOLS } from '../hooks/useDrawingContext';
import './Toolbar.css';

function Toolbar() {
  const { activeTool, setActiveTool } = useDrawing();

  const tools = [
    {
      id: DRAWING_TOOLS.SELECT,
      icon: '↖',
      label: 'Select',
      shortcut: 'V'
    },
    {
      id: DRAWING_TOOLS.LINE,
      icon: '📏',
      label: 'Line',
      shortcut: 'L'
    },
    {
      id: DRAWING_TOOLS.RECTANGLE,
      icon: '⬜',
      label: 'Rectangle',
      shortcut: 'R'
    },
    {
      id: DRAWING_TOOLS.CIRCLE,
      icon: '⭕',
      label: 'Circle',
      shortcut: 'C'
    },
    {
      id: DRAWING_TOOLS.POLYGON,
      icon: '⬢',
      label: 'Polygon',
      shortcut: 'P'
    },
    {
      id: DRAWING_TOOLS.FREEHAND,
      icon: '✏️',
      label: 'Freehand',
      shortcut: 'F'
    },
    {
      id: DRAWING_TOOLS.MEASURE,
      icon: '📐',
      label: 'Measure',
      shortcut: 'M'
    },
    {
      id: DRAWING_TOOLS.TEXT,
      icon: '📝',
      label: 'Text',
      shortcut: 'T'
    }
  ];

  const handleToolSelect = (toolId) => {
    setActiveTool(toolId);
  };

  return (
    <div className="toolbar">
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
          onClick={() => handleToolSelect(tool.id)}
          title={`${tool.label} (${tool.shortcut})`}
        >
          <span className="tool-icon">{tool.icon}</span>
        </button>
      ))}
      
      <div className="toolbar-separator" />
      
      <button className="tool-button" title="Undo (Ctrl+Z)">
        ↶
      </button>
      <button className="tool-button" title="Redo (Ctrl+Y)">
        ↷
      </button>
      
      <div className="toolbar-separator" />
      
      <button className="tool-button" title="Zoom In">
        🔍+
      </button>
      <button className="tool-button" title="Zoom Out">
        🔍-
      </button>
      <button className="tool-button" title="Fit to Screen">
        📄
      </button>
    </div>
  );
}

export default Toolbar;

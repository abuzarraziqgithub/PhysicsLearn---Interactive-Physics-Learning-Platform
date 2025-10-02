import React, { useEffect, useRef, useState } from 'react';
import { useDrawing, DRAWING_TOOLS } from '../hooks/useDrawingContext';
import './DrawingCanvas.css';

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const {
    activeTool,
    isDrawing,
    setDrawingState,
    addObject,
    selectedObjects,
    selectObject,
    clearSelection,
    showGrid,
    gridSize,
    snapToGrid,
    zoom,
    panOffset,
    drawingSettings
  } = useDrawing();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set up canvas styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = drawingSettings.strokeColor;
    ctx.lineWidth = drawingSettings.strokeWidth;
    ctx.fillStyle = drawingSettings.fillColor;
    ctx.globalAlpha = drawingSettings.opacity;

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
  }, [showGrid, gridSize, zoom, panOffset, drawingSettings]);

  const drawGrid = (ctx, width, height) => {
    ctx.save();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    // Calculate grid offset based on pan
    const offsetX = panOffset.x % gridSize;
    const offsetY = panOffset.y % gridSize;
    
    // Draw vertical lines
    for (let x = -offsetX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = -offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const snapToGridPoint = (point) => {
    if (!snapToGrid) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    const snappedPos = snapToGridPoint(pos);
    
    setMousePos(snappedPos);
    setStartPos(snappedPos);
    
    switch (activeTool) {
      case DRAWING_TOOLS.LINE:
      case DRAWING_TOOLS.RECTANGLE:
      case DRAWING_TOOLS.CIRCLE:
        setDrawingState(true);
        setCurrentPath([snappedPos]);
        break;
      
      case DRAWING_TOOLS.POLYGON:
        if (!isDrawing) {
          setDrawingState(true);
          setCurrentPath([snappedPos]);
        } else {
          setCurrentPath(prev => [...prev, snappedPos]);
        }
        break;
      
      case DRAWING_TOOLS.FREEHAND:
        setDrawingState(true);
        setCurrentPath([snappedPos]);
        break;
      
      case DRAWING_TOOLS.SELECT:
        // Handle selection logic
        break;
      
      default:
        break;
    }
  };

  const handleMouseMove = (e) => {
    const pos = getMousePos(e);
    const snappedPos = snapToGridPoint(pos);
    
    setMousePos(snappedPos);
    
    if (!isDrawing) return;
    
    // Update current drawing
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    
    // Draw current path
    if (currentPath.length > 0) {
      drawCurrentPath(ctx, currentPath, snappedPos);
    }
  };

  const drawCurrentPath = (ctx, path, currentPos) => {
    ctx.save();
    ctx.strokeStyle = drawingSettings.strokeColor;
    ctx.lineWidth = drawingSettings.strokeWidth;
    ctx.fillStyle = drawingSettings.fillColor;
    ctx.globalAlpha = drawingSettings.opacity;
    
    switch (activeTool) {
      case DRAWING_TOOLS.LINE:
        if (path.length >= 1) {
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          ctx.lineTo(currentPos.x, currentPos.y);
          ctx.stroke();
        }
        break;
      
      case DRAWING_TOOLS.RECTANGLE:
        if (path.length >= 1) {
          const width = currentPos.x - path[0].x;
          const height = currentPos.y - path[0].y;
          ctx.strokeRect(path[0].x, path[0].y, width, height);
          if (drawingSettings.fillColor !== 'transparent') {
            ctx.fillRect(path[0].x, path[0].y, width, height);
          }
        }
        break;
      
      case DRAWING_TOOLS.CIRCLE:
        if (path.length >= 1) {
          const radius = Math.sqrt(
            Math.pow(currentPos.x - path[0].x, 2) + 
            Math.pow(currentPos.y - path[0].y, 2)
          );
          ctx.beginPath();
          ctx.arc(path[0].x, path[0].y, radius, 0, 2 * Math.PI);
          ctx.stroke();
          if (drawingSettings.fillColor !== 'transparent') {
            ctx.fill();
          }
        }
        break;
      
      case DRAWING_TOOLS.POLYGON:
        if (path.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }
          ctx.lineTo(currentPos.x, currentPos.y);
          ctx.stroke();
          if (drawingSettings.fillColor !== 'transparent' && path.length >= 3) {
            ctx.fill();
          }
        }
        break;
      
      case DRAWING_TOOLS.FREEHAND:
        if (path.length >= 1) {
          ctx.beginPath();
          ctx.moveTo(path[path.length - 1].x, path[path.length - 1].y);
          ctx.lineTo(currentPos.x, currentPos.y);
          ctx.stroke();
        }
        break;
    }
    
    ctx.restore();
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    const snappedPos = snapToGridPoint(pos);
    
    // Create object based on tool
    let newObject = null;
    
    switch (activeTool) {
      case DRAWING_TOOLS.LINE:
        if (currentPath.length >= 1) {
          newObject = {
            id: Date.now(),
            type: 'line',
            points: [currentPath[0], snappedPos],
            settings: { ...drawingSettings }
          };
        }
        break;
      
      case DRAWING_TOOLS.RECTANGLE:
        if (currentPath.length >= 1) {
          newObject = {
            id: Date.now(),
            type: 'rectangle',
            x: currentPath[0].x,
            y: currentPath[0].y,
            width: snappedPos.x - currentPath[0].x,
            height: snappedPos.y - currentPath[0].y,
            settings: { ...drawingSettings }
          };
        }
        break;
      
      case DRAWING_TOOLS.CIRCLE:
        if (currentPath.length >= 1) {
          const radius = Math.sqrt(
            Math.pow(snappedPos.x - currentPath[0].x, 2) + 
            Math.pow(snappedPos.y - currentPath[0].y, 2)
          );
          newObject = {
            id: Date.now(),
            type: 'circle',
            x: currentPath[0].x,
            y: currentPath[0].y,
            radius: radius,
            settings: { ...drawingSettings }
          };
        }
        break;
      
      case DRAWING_TOOLS.POLYGON:
        if (currentPath.length >= 3) {
          newObject = {
            id: Date.now(),
            type: 'polygon',
            points: [...currentPath, snappedPos],
            settings: { ...drawingSettings }
          };
        }
        break;
      
      case DRAWING_TOOLS.FREEHAND:
        if (currentPath.length >= 2) {
          newObject = {
            id: Date.now(),
            type: 'freehand',
            points: [...currentPath, snappedPos],
            settings: { ...drawingSettings }
          };
        }
        break;
    }
    
    if (newObject) {
      addObject(newObject);
    }
    
    // Reset drawing state
    setDrawingState(false);
    setCurrentPath([]);
    setStartPos(null);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      
      {/* Status bar */}
      <div className="canvas-status">
        <span>Tool: {activeTool}</span>
        <span>Position: {Math.round(mousePos.x)}, {Math.round(mousePos.y)}</span>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}

export default DrawingCanvas;

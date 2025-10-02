import React, { createContext, useContext, useReducer, useRef } from 'react';

const DrawingContext = createContext();

// Drawing tools
export const DRAWING_TOOLS = {
  SELECT: 'select',
  LINE: 'line',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  POLYGON: 'polygon',
  FREEHAND: 'freehand',
  MEASURE: 'measure',
  TEXT: 'text'
};

// Initial state
const initialState = {
  activeTool: DRAWING_TOOLS.SELECT,
  isDrawing: false,
  currentPath: null,
  objects: [],
  selectedObjects: [],
  canvasSize: { width: 800, height: 600 },
  gridSize: 20,
  snapToGrid: true,
  showGrid: true,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  drawingSettings: {
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 2,
    opacity: 1
  },
  measurementSettings: {
    unit: 'feet',
    precision: 2
  },
  wallSettings: {
    height: 10, // feet
    thickness: 6, // inches
    material: 'concrete'
  }
};

// Action types
const ACTION_TYPES = {
  SET_ACTIVE_TOOL: 'SET_ACTIVE_TOOL',
  SET_DRAWING_STATE: 'SET_DRAWING_STATE',
  ADD_OBJECT: 'ADD_OBJECT',
  UPDATE_OBJECT: 'UPDATE_OBJECT',
  DELETE_OBJECT: 'DELETE_OBJECT',
  SELECT_OBJECT: 'SELECT_OBJECT',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  SET_CANVAS_SIZE: 'SET_CANVAS_SIZE',
  SET_GRID_SETTINGS: 'SET_GRID_SETTINGS',
  SET_ZOOM: 'SET_ZOOM',
  SET_PAN: 'SET_PAN',
  UPDATE_DRAWING_SETTINGS: 'UPDATE_DRAWING_SETTINGS',
  UPDATE_MEASUREMENT_SETTINGS: 'UPDATE_MEASUREMENT_SETTINGS',
  UPDATE_WALL_SETTINGS: 'UPDATE_WALL_SETTINGS',
  CLEAR_CANVAS: 'CLEAR_CANVAS'
};

// Reducer
function drawingReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_ACTIVE_TOOL:
      return {
        ...state,
        activeTool: action.payload,
        selectedObjects: []
      };
    
    case ACTION_TYPES.SET_DRAWING_STATE:
      return {
        ...state,
        isDrawing: action.payload.isDrawing,
        currentPath: action.payload.currentPath || null
      };
    
    case ACTION_TYPES.ADD_OBJECT:
      return {
        ...state,
        objects: [...state.objects, action.payload],
        currentPath: null
      };
    
    case ACTION_TYPES.UPDATE_OBJECT:
      return {
        ...state,
        objects: state.objects.map(obj => 
          obj.id === action.payload.id 
            ? { ...obj, ...action.payload.updates }
            : obj
        )
      };
    
    case ACTION_TYPES.DELETE_OBJECT:
      return {
        ...state,
        objects: state.objects.filter(obj => obj.id !== action.payload),
        selectedObjects: state.selectedObjects.filter(id => id !== action.payload)
      };
    
    case ACTION_TYPES.SELECT_OBJECT:
      const objectId = action.payload;
      const isSelected = state.selectedObjects.includes(objectId);
      return {
        ...state,
        selectedObjects: isSelected
          ? state.selectedObjects.filter(id => id !== objectId)
          : [...state.selectedObjects, objectId]
      };
    
    case ACTION_TYPES.CLEAR_SELECTION:
      return {
        ...state,
        selectedObjects: []
      };
    
    case ACTION_TYPES.SET_CANVAS_SIZE:
      return {
        ...state,
        canvasSize: action.payload
      };
    
    case ACTION_TYPES.SET_GRID_SETTINGS:
      return {
        ...state,
        gridSize: action.payload.gridSize,
        snapToGrid: action.payload.snapToGrid,
        showGrid: action.payload.showGrid
      };
    
    case ACTION_TYPES.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload
      };
    
    case ACTION_TYPES.SET_PAN:
      return {
        ...state,
        panOffset: action.payload
      };
    
    case ACTION_TYPES.UPDATE_DRAWING_SETTINGS:
      return {
        ...state,
        drawingSettings: { ...state.drawingSettings, ...action.payload }
      };
    
    case ACTION_TYPES.UPDATE_MEASUREMENT_SETTINGS:
      return {
        ...state,
        measurementSettings: { ...state.measurementSettings, ...action.payload }
      };
    
    case ACTION_TYPES.UPDATE_WALL_SETTINGS:
      return {
        ...state,
        wallSettings: { ...state.wallSettings, ...action.payload }
      };
    
    case ACTION_TYPES.CLEAR_CANVAS:
      return {
        ...state,
        objects: [],
        selectedObjects: [],
        currentPath: null
      };
    
    default:
      return state;
  }
}

// Provider component
export function DrawingProvider({ children }) {
  const [state, dispatch] = useReducer(drawingReducer, initialState);
  const canvasRef = useRef(null);

  const actions = {
    setActiveTool: (tool) => 
      dispatch({ type: ACTION_TYPES.SET_ACTIVE_TOOL, payload: tool }),
    
    setDrawingState: (isDrawing, currentPath = null) =>
      dispatch({ type: ACTION_TYPES.SET_DRAWING_STATE, payload: { isDrawing, currentPath } }),
    
    addObject: (object) =>
      dispatch({ type: ACTION_TYPES.ADD_OBJECT, payload: object }),
    
    updateObject: (id, updates) =>
      dispatch({ type: ACTION_TYPES.UPDATE_OBJECT, payload: { id, updates } }),
    
    deleteObject: (id) =>
      dispatch({ type: ACTION_TYPES.DELETE_OBJECT, payload: id }),
    
    selectObject: (id) =>
      dispatch({ type: ACTION_TYPES.SELECT_OBJECT, payload: id }),
    
    clearSelection: () =>
      dispatch({ type: ACTION_TYPES.CLEAR_SELECTION }),
    
    setCanvasSize: (size) =>
      dispatch({ type: ACTION_TYPES.SET_CANVAS_SIZE, payload: size }),
    
    setGridSettings: (gridSize, snapToGrid, showGrid) =>
      dispatch({ type: ACTION_TYPES.SET_GRID_SETTINGS, payload: { gridSize, snapToGrid, showGrid } }),
    
    setZoom: (zoom) =>
      dispatch({ type: ACTION_TYPES.SET_ZOOM, payload: zoom }),
    
    setPan: (offset) =>
      dispatch({ type: ACTION_TYPES.SET_PAN, payload: offset }),
    
    updateDrawingSettings: (settings) =>
      dispatch({ type: ACTION_TYPES.UPDATE_DRAWING_SETTINGS, payload: settings }),
    
    updateMeasurementSettings: (settings) =>
      dispatch({ type: ACTION_TYPES.UPDATE_MEASUREMENT_SETTINGS, payload: settings }),
    
    updateWallSettings: (settings) =>
      dispatch({ type: ACTION_TYPES.UPDATE_WALL_SETTINGS, payload: settings }),
    
    clearCanvas: () =>
      dispatch({ type: ACTION_TYPES.CLEAR_CANVAS })
  };

  const value = {
    ...state,
    ...actions,
    canvasRef
  };

  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  );
}

// Hook to use the drawing context
export function useDrawing() {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
}

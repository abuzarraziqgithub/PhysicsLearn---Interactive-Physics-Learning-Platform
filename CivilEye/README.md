# CivilEye - Residential CAD Tool

A modern web-based CAD application designed for residential mapping and 3D visualization. Built with React and Three.js, CivilEye makes architectural drawing accessible to homeowners and small construction businesses.

## Features

### 2D Drawing Tools
- **Line Tool**: Draw straight lines with precision
- **Rectangle Tool**: Create rectangular shapes for rooms
- **Circle Tool**: Draw circular elements
- **Polygon Tool**: Create complex polygonal shapes
- **Freehand Tool**: Draw custom shapes
- **Measurement Tool**: Measure distances and areas
- **Text Tool**: Add annotations and labels

### 3D Visualization
- **Automatic 3D Conversion**: Convert 2D drawings to 3D structures
- **Wall Generation**: Create walls with customizable height and thickness
- **Material Selection**: Choose from various building materials
- **Interactive 3D View**: Rotate, zoom, and pan in 3D space
- **Dimension Display**: Show measurements in 3D view

### Professional Features
- **Grid System**: Snap-to-grid functionality for precision
- **Customizable Units**: Support for feet, meters, inches, centimeters
- **Export Options**: Save projects and export to common formats
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Measurements**: Automatic dimensioning and area calculation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CivilEye
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Usage

### Creating a 2D Drawing

1. **Select a Tool**: Choose from the toolbar (Line, Rectangle, Circle, etc.)
2. **Configure Settings**: Adjust stroke color, fill color, and line width in the Properties panel
3. **Draw**: Click and drag on the canvas to create shapes
4. **Measure**: Use the measurement tool to add dimensions
5. **Customize**: Select objects to modify their properties

### Converting to 3D

1. **Complete 2D Plan**: Finish your floor plan in 2D view
2. **Switch to 3D**: Click the "3D View" button in the header
3. **Configure Walls**: Set wall height, thickness, and material in Properties
4. **Generate 3D**: Click "Generate 3D" to create the 3D model
5. **Explore**: Use mouse controls to rotate and zoom the 3D model

### Keyboard Shortcuts

- **V**: Select tool
- **L**: Line tool
- **R**: Rectangle tool
- **C**: Circle tool
- **P**: Polygon tool
- **F**: Freehand tool
- **M**: Measurement tool
- **T**: Text tool

## Technology Stack

- **Frontend**: React 18
- **3D Graphics**: Three.js with React Three Fiber
- **Canvas**: HTML5 Canvas for 2D drawing
- **State Management**: React Context API
- **Styling**: CSS3 with responsive design
- **Build Tool**: Create React App

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Application header
│   ├── Toolbar.js      # Drawing tools toolbar
│   ├── DrawingCanvas.js # 2D drawing canvas
│   ├── Viewport3D.js   # 3D visualization
│   ├── Building3D.js   # 3D building generation
│   └── PropertiesPanel.js # Properties and settings
├── hooks/              # Custom React hooks
│   └── useDrawingContext.js # Drawing state management
├── styles/             # CSS styles
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Phase 1 (Current)
- [x] Basic 2D drawing tools
- [x] 2D to 3D conversion
- [x] Basic 3D visualization
- [x] Grid system and snap functionality

### Phase 2 (Planned)
- [ ] Advanced measurement tools
- [ ] Layer management
- [ ] Import/Export functionality
- [ ] User accounts and cloud storage
- [ ] Collaborative editing

### Phase 3 (Future)
- [ ] Integration with mapping services
- [ ] Advanced 3D features (roofs, windows, doors)
- [ ] Material cost estimation
- [ ] Mobile app version
- [ ] API for third-party integrations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@civil-eye.com
- Documentation: [docs.civil-eye.com](https://docs.civil-eye.com)

## Acknowledgments

- Three.js community for excellent 3D graphics library
- React team for the amazing framework
- Autodesk for inspiration from AutoCAD
- Google for SketchUp inspiration

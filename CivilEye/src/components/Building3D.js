import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';

function Building3D({ objects, wallSettings, showDimensions }) {
  const buildingComponents = useMemo(() => {
    return objects.map((obj, index) => {
      switch (obj.type) {
        case 'rectangle':
          return createWall(obj, wallSettings, index, showDimensions);
        case 'line':
          return createLine(obj, wallSettings, index, showDimensions);
        case 'polygon':
          return createPolygonWall(obj, wallSettings, index, showDimensions);
        default:
          return null;
      }
    }).filter(Boolean);
  }, [objects, wallSettings, showDimensions]);

  return (
    <group>
      {buildingComponents}
    </group>
  );
}

function createWall(obj, wallSettings, index, showDimensions) {
  const thickness = wallSettings.thickness / 12; // Convert inches to feet
  const height = wallSettings.height;
  
  // Create wall geometry
  const wallGeometry = {
    width: Math.abs(obj.width),
    height: height,
    thickness: thickness
  };

  return (
    <group key={`wall-${index}`}>
      {/* Main wall */}
      <mesh 
        position={[
          obj.x + obj.width / 2, 
          height / 2, 
          obj.y + obj.height / 2
        ]}
      >
        <boxGeometry 
          args={[wallGeometry.width, wallGeometry.height, wallGeometry.thickness]} 
        />
        <meshLambertMaterial color={getMaterialColor(wallSettings.material)} />
      </mesh>
      
      {/* Floor */}
      <mesh 
        position={[
          obj.x + obj.width / 2, 
          0, 
          obj.y + obj.height / 2
        ]}
      >
        <boxGeometry 
          args={[wallGeometry.width, 0.1, wallGeometry.thickness]} 
        />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Dimensions */}
      {showDimensions && (
        <group>
          {/* Width dimension */}
          <Text
            position={[obj.x + obj.width / 2, height + 2, obj.y]}
            fontSize={2}
            color="#333333"
            anchorX="center"
            anchorY="middle"
          >
            {obj.width.toFixed(1)} ft
          </Text>
          
          {/* Height dimension */}
          <Text
            position={[obj.x - 3, height / 2, obj.y + obj.height / 2]}
            fontSize={2}
            color="#333333"
            anchorX="center"
            anchorY="middle"
          >
            {height} ft
          </Text>
        </group>
      )}
    </group>
  );
}

function createLine(obj, wallSettings, index, showDimensions) {
  const thickness = wallSettings.thickness / 12;
  const height = wallSettings.height;
  
  // Calculate line length and angle
  const start = obj.points[0];
  const end = obj.points[1];
  const length = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  
  return (
    <group key={`line-${index}`}>
      {/* Wall segment */}
      <mesh 
        position={[
          (start.x + end.x) / 2, 
          height / 2, 
          (start.y + end.y) / 2
        ]}
        rotation={[0, -angle, 0]}
      >
        <boxGeometry args={[length, height, thickness]} />
        <meshLambertMaterial color={getMaterialColor(wallSettings.material)} />
      </mesh>
      
      {/* Floor segment */}
      <mesh 
        position={[
          (start.x + end.x) / 2, 
          0, 
          (start.y + end.y) / 2
        ]}
        rotation={[0, -angle, 0]}
      >
        <boxGeometry args={[length, 0.1, thickness]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Dimensions */}
      {showDimensions && (
        <Text
          position={[(start.x + end.x) / 2, height + 2, (start.y + end.y) / 2]}
          fontSize={2}
          color="#333333"
          anchorX="center"
          anchorY="middle"
        >
          {length.toFixed(1)} ft
        </Text>
      )}
    </group>
  );
}

function createPolygonWall(obj, wallSettings, index, showDimensions) {
  const thickness = wallSettings.thickness / 12;
  const height = wallSettings.height;
  
  return (
    <group key={`polygon-${index}`}>
      {obj.points.map((point, pointIndex) => {
        const nextPoint = obj.points[(pointIndex + 1) % obj.points.length];
        const length = Math.sqrt(
          Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
        );
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
        
        return (
          <group key={`segment-${pointIndex}`}>
            {/* Wall segment */}
            <mesh 
              position={[
                (point.x + nextPoint.x) / 2, 
                height / 2, 
                (point.y + nextPoint.y) / 2
              ]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[length, height, thickness]} />
              <meshLambertMaterial color={getMaterialColor(wallSettings.material)} />
            </mesh>
            
            {/* Floor segment */}
            <mesh 
              position={[
                (point.x + nextPoint.x) / 2, 
                0, 
                (point.y + nextPoint.y) / 2
              ]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[length, 0.1, thickness]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
          </group>
        );
      })}
      
      {/* Center area floor */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#8B4513" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function getMaterialColor(material) {
  const colors = {
    concrete: '#A0A0A0',
    brick: '#B87333',
    wood: '#8B4513',
    steel: '#C0C0C0',
    glass: '#87CEEB'
  };
  return colors[material] || colors.concrete;
}

export default Building3D;

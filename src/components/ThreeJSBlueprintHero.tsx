import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, Edges } from '@react-three/drei';
import * as THREE from 'three';

const FLOOR_COUNT = 8;
const FLOOR_HEIGHT = 1.2;
const FLOOR_WIDTH = 4;
const FLOOR_DEPTH = 4;

function BuildingConstruction() {
  const groupRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime((t) => (t + delta) % 10);
    // Rotate building slightly
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const floors = useMemo(() => {
    return Array.from({ length: FLOOR_COUNT }).map((_, i) => {
      return { i, height: i * FLOOR_HEIGHT };
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, -FLOOR_COUNT * FLOOR_HEIGHT * 0.5, 0]}>
      {floors.map((floor) => {
        const appearTime = floor.i * 1.0; 
        const isVisible = time > appearTime;
        const progress = Math.min(Math.max((time - appearTime) / 0.5, 0), 1);
        
        // Steel frame scale and position
        const frameScaleY = isVisible ? progress : 0;
        
        // Floor slab scale and position
        const floorAppearsTime = appearTime + 0.4;
        const floorProgress = Math.min(Math.max((time - floorAppearsTime) / 0.3, 0), 1);

        return (
          <group key={floor.i} position={[0, floor.height, 0]}>
            {/* Corner columns */}
            {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], idx) => (
               <mesh key={`col-${idx}`} position={[x * (FLOOR_WIDTH/2 - 0.1), (FLOOR_HEIGHT/2) * frameScaleY, z * (FLOOR_DEPTH/2 - 0.1)]} scale={[1, frameScaleY, 1]} castShadow receiveShadow>
                 <boxGeometry args={[0.2, FLOOR_HEIGHT, 0.2]} />
                 <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} transparent opacity={Math.max(0.1, progress)} />
               </mesh>
            ))}
            {/* Concrete Slab */}
            <mesh position={[0, FLOOR_HEIGHT, 0]} scale={[floorProgress, floorProgress > 0 ? 1 : 0, floorProgress]} castShadow receiveShadow>
              <boxGeometry args={[FLOOR_WIDTH, 0.2, FLOOR_DEPTH]} />
              <meshStandardMaterial color="#94a3b8" />
              {floorProgress > 0 && <Edges scale={1.0} threshold={15} color="#e2e8f0" />}
            </mesh>
          </group>
        );
      })}
      
      {/* Animated Crane */}
      <group position={[FLOOR_WIDTH/2 + 1, time > 8 ? FLOOR_COUNT * FLOOR_HEIGHT : time * (FLOOR_COUNT * FLOOR_HEIGHT / 8), FLOOR_DEPTH/2 + 1]}>
         {/* Tower */}
         <mesh position={[0, -2, 0]}>
           <boxGeometry args={[0.4, 4, 0.4]} />
           <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.5} />
           <Edges scale={1.05} color="#fbbf24" />
         </mesh>
         
         <group rotation-y={time * 0.5}>
            {/* Jib */}
           <mesh position={[-1.5, 0, 0]}>
             <boxGeometry args={[4, 0.3, 0.3]} />
             <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.5} />
           </mesh>
           {/* Hook line */}
           <mesh position={[-3, -1 - Math.sin(time*Math.PI)*0.5, 0]}>
             <boxGeometry args={[0.05, 2 + Math.sin(time*Math.PI), 0.05]} />
             <meshStandardMaterial color="#000000" />
           </mesh>
           {/* Load */}
           <mesh position={[-3, -2 - Math.sin(time*Math.PI)*1.5, 0]}>
             <boxGeometry args={[0.5, 0.5, 0.5]} />
             <meshStandardMaterial color="#94a3b8" />
           </mesh>
         </group>
      </group>
    </group>
  );
}

export function ThreeJSBlueprintHero() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas 
         camera={{ position: [10, 8, 10], fov: 35, near: 0.1, far: 1000 }}
         shadows
      >
        <ambientLight intensity={1.5} />
        <directionalLight 
           position={[10, 20, 10]} 
           intensity={1.5} 
           castShadow
           color="#ffffff"
        />
        <pointLight position={[-10, 10, -10]} intensity={1.0} color="#8b5cf6" />
        <pointLight position={[10, 5, 10]} intensity={1.5} color="#f97316" />
        <Bounds fit clip observe margin={1.2}>
          <BuildingConstruction />
        </Bounds>
      </Canvas>
    </div>
  );
}

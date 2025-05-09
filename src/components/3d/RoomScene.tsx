// src/components/3d/RoomScene.tsx
/**
 * Purpose: Renders the main 3D room scene with furniture and interactive elements.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useRoomAnimation } from 'src/hooks/useRoomAnimation';
import { Lights } from 'src/components/3d/Lights';
import { ModelLoader } from 'src/utils/modelLoader';
import { Controls } from 'src/components/3d/Controls';
import { roomConfig } from 'src/utils/roomConfig';
import { threeUtils } from 'src/utils/three-utils';
import 'src/styles/components/room-scene.css';

interface RoomSceneProps {
  // Define props here if needed; for MVP, assume no props are directly passed.
}

interface InteractiveElement {
  name: string;
  object: THREE.Object3D;
}

const RoomScene: React.FC<RoomSceneProps> = () => {
  const [model, setModel] = useState<GLTF | null>(null);
  const [interactiveElements, setInteractiveElements] = useState<InteractiveElement[]>([]);
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dustMotes, setDustMotes] = useState<THREE.InstancedMesh | null>(null);
  const roomSceneRef = useRef<THREE.Scene | null>(null);
  const gltfSceneRef = useRef<THREE.Scene | null>(null);
  const gltfCameraRef = useRef<THREE.Camera | null>(null);
  const gltfLightsRef = useRef<(THREE.Light | THREE.SpotLight | THREE.DirectionalLight)[]>([]);

  const { dustMoteCount, driftSpeed } = useRoomAnimation();
  const modelPath = 'public/models/room.glb';

  const interactiveElementNames = roomConfig.interactiveElementIds;

  const handleObjectHover = useCallback((object: THREE.Object3D | null) => {
    setHoveredObject(object);
  }, []);

  useEffect(() => {
    const loadGltfModel = async () => {
      try {
        const gltf = await ModelLoader.loadModel(modelPath);
        setModel(gltf);
        setIsLoaded(true);
        gltfSceneRef.current = gltf.scene;

        // Extract the camera and lights
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Camera) {
            gltfCameraRef.current = child;
          }
          if (child instanceof THREE.Light) {
            gltfLightsRef.current.push(child);
          }
        });

        const foundInteractiveElements: InteractiveElement[] = [];
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && interactiveElementNames.includes(child.name)) {
            foundInteractiveElements.push({ name: child.name, object: child });
          }
        });
        setInteractiveElements(foundInteractiveElements);

        if (foundInteractiveElements.length !== interactiveElementNames.length) {
          console.warn('Not all interactive elements were found in the model.');
        }
      } catch (error: any) {
        console.error('Failed to load model:', error);
        setLoadingError('Failed to load 3D model. Please try again later.');
      }
    };

    loadGltfModel();
  }, [modelPath, interactiveElementNames]);

  useEffect(() => {
    if (model) {
      const geometry = new THREE.SphereGeometry(0.02, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const instanceCount = dustMoteCount;
      const dust = new THREE.InstancedMesh(geometry, material, instanceCount);

      for (let i = 0; i < instanceCount; i++) {
        const x = Math.random() * 5 - 2.5;
        const y = Math.random() * 3 + 1;
        const z = Math.random() * 5 - 2.5;
        const matrix = new THREE.Matrix4();
        matrix.setPosition(x, y, z);
        dust.setMatrixAt(i, matrix);
      }

      dust.instanceMatrix.needsUpdate = true;
      setDustMotes(dust);
      if (roomSceneRef.current) {
          roomSceneRef.current.add(dust);
      }
    }

    return () => {
      if (dustMotes) {
        dustMotes.geometry.dispose();
        (dustMotes.material as THREE.Material).dispose();
        if (roomSceneRef.current) {
            roomSceneRef.current.remove(dustMotes);
        }
      }
    };
  }, [model, dustMoteCount]);

  useFrame(() => {
    if (dustMotes) {
      for (let i = 0; i < dustMoteCount; i++) {
        const matrix = new THREE.Matrix4();
        dustMotes.getMatrixAt(i, matrix);
        const position = new THREE.Vector3();
        position.setFromMatrixPosition(matrix);
        position.x += driftSpeed * 0.1 * (Math.random() - 0.5);
        position.y += driftSpeed * 0.1 * (Math.random() - 0.5);
        position.z += driftSpeed * 0.1 * (Math.random() - 0.5);

        if (position.x > 2.5) position.x = -2.5;
        if (position.x < -2.5) position.x = 2.5;
        if (position.y > 4) position.y = 1;
        if (position.y < 1) position.y = 4;
        if (position.z > 2.5) position.z = -2.5;
        if (position.z < -2.5) position.z = 2.5;

        matrix.setPosition(position);
        dustMotes.setMatrixAt(i, matrix);
      }
      dustMotes.instanceMatrix.needsUpdate = true;
    }
  });

  const onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!model) return;

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const pointer = new THREE.Vector2();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const intersectedObject = threeUtils.getIntersectedObject(pointer, gltfSceneRef.current, gltfCameraRef.current);

    if (intersectedObject) {
      console.log(`Clicked on object: ${intersectedObject.name}`);
    }
  };

  return (
    <div className="room-scene-container">
      {loadingError && <div className="error-message">{loadingError}</div>}
      {!isLoaded && !loadingError && <div className="loading-message">Loading 3D scene...</div>}
      <Canvas
        shadows
        camera={{ position: [5, 2, 8], fov: 65 }}
        className="room-scene-canvas"
        onClick={onCanvasClick}
        onPointerMove={(e) => {
          if (!model || !gltfSceneRef.current || !gltfCameraRef.current) return;
          const canvas = e.currentTarget;
          const rect = canvas.getBoundingClientRect();
          const pointer = new THREE.Vector2();
          pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          const intersectedObject = threeUtils.getIntersectedObject(pointer, gltfSceneRef.current, gltfCameraRef.current);
          handleObjectHover(intersectedObject);
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 5, 3]} intensity={0.8} castShadow />
        <Lights/>
        <Controls/>
        {model && (
          <group ref={roomSceneRef} dispose={null}>
            <primitive object={model.scene} />
            {hoveredObject && (
              <mesh>
                <mesh geometry={(hoveredObject as THREE.Mesh).geometry} material={new THREE.MeshStandardMaterial({ color: "yellow", emissive: "yellow" })} position={(hoveredObject as THREE.Mesh).position}  scale={(hoveredObject as THREE.Mesh).scale}/>
                <boxHelper object={hoveredObject} color="black" />
              </mesh>
            )}
          </group>
        )}
        {/* Environment Effects */}
        <Environment preset="city" blur={0.5} />
      </Canvas>
    </div>
  );
};

export default RoomScene;
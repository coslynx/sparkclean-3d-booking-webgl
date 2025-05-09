// src/components/3d/ProductShowcase.tsx
/**
 * Purpose: Displays a rotating showcase of 3D cleaning product models.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { ModelLoader } from 'src/utils/modelLoader';
import 'src/styles/components/product-showcase.css';

interface ProductShowcaseProps {
  modelPaths: string[]; // Array of paths to GLTF/GLB product models
  radius?: number;      // Radius of the circular arrangement (default: 2)
  rotationSpeed?: number; // Rotation speed of the models (default: 0.01)
  onProductClick?: (modelPath: string) => void; // Optional click handler
}

interface ProductModel {
  path: string;
  gltf: GLTF;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  modelPaths,
  radius = 2,
  rotationSpeed = 0.01,
  onProductClick,
}) => {
  const [productModels, setProductModels] = useState<ProductModel[]>([]);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      if (!modelPaths || modelPaths.length === 0) {
        console.warn('No model paths provided to ProductShowcase.');
        return;
      }

      const loadedModels: ProductModel[] = [];
      for (const path of modelPaths) {
        if (typeof path !== 'string' || path.trim() === '') {
          console.error('Invalid model path:', path);
          continue;
        }
        try {
          const gltf = await ModelLoader.loadModel(path);
          loadedModels.push({ path, gltf });
        } catch (error) {
          console.error(`Error loading model from ${path}:`, error);
        }
      }
      setProductModels(loadedModels);
    };

    loadModels();
  }, [modelPaths]);

  useFrame(({ clock }) => {
    productModels.forEach((product, index) => {
      if (product.gltf && product.gltf.scene) {
        const angle = clock.getElapsedTime() * rotationSpeed + (index / productModels.length) * Math.PI * 2;
        product.gltf.scene.position.x = radius * Math.cos(angle);
        product.gltf.scene.position.z = radius * Math.sin(angle);
      }
    });
  });

  const handleModelHover = useCallback((modelPath: string | null) => {
    setHoveredModel(modelPath);
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onProductClick) return;

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const pointer = new THREE.Vector2();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (!sceneRef.current) return;
    const camera = sceneRef.current.getObjectByName('camera') as THREE.Camera;
    if (!camera) return;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);

    const intersectedObjects = raycaster.intersectObjects(sceneRef.current.children, true);

    if (intersectedObjects.length > 0 && productModels.length > 0) {
      const intersectedObject = intersectedObjects[0].object;
      const productModel = productModels.find(product => product.gltf.scene.children.includes(intersectedObject));
      if (productModel) {
        onProductClick(productModel.path);
      }
    }
  }, [onProductClick, productModels]);

  return (
    <div className="product-showcase-container">
      {loadingError && <div className="error-message">{loadingError}</div>}
      {modelPaths.length === 0 && <div className="loading-message">No Products to Showcase.</div>}
      <Canvas
        shadows
        camera={{ position: [0, 1, 5], fov: 45, name: 'camera' }}
        className="product-showcase-canvas"
        onClick={handleCanvasClick}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <OrbitControls enableZoom={false} autoRotateSpeed={0.5} autoRotate={true} enableDamping dampingFactor={0.1}/>
        <group ref={sceneRef}>
          {productModels.map((product, index) => {
            if (!product.gltf) return null;

            return (
              <primitive
                key={index}
                object={product.gltf.scene}
                position={[0, 0, 0]} // Position will be updated by useFrame
                onPointerOver={() => handleModelHover(product.path)}
                onPointerOut={() => handleModelHover(null)}
              >
                {hoveredModel === product.path && product.gltf.scene && product.gltf.scene.children.map((child, childIndex) => {
                  if ((child as THREE.Mesh).isMesh) {
                    return (
                      <mesh key={childIndex}
                      geometry={(child as THREE.Mesh).geometry}
                      material={new THREE.MeshStandardMaterial({
                      color: (child as THREE.Mesh).material['color'],
                      emissive: "yellow",
                      emissiveIntensity: 0.5,
                      roughness: 0.5,
                      metalness: 0.5,
                      })}
                      position={(child as THREE.Mesh).position}
                      rotation={(child as THREE.Mesh).rotation}
                      scale={(child as THREE.Mesh).scale}
                      />
                    );
                  }
                  return null;
                })}
              </primitive>
            );
          })}
        </group>
      </Canvas>
    </div>
  );
};

export default ProductShowcase;
// src/hooks/useProductAnimation.ts
/**
 * Purpose: Provides a custom React hook for managing animations of product models.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProductAnimation {
  rotation: THREE.Euler;
  setRotation: (rotation: THREE.Euler) => void;
  highlightIntensity: number;
  setHighlightIntensity: (intensity: number) => void;
  animate: () => void;
}

const useProductAnimation = (initialRotationSpeed: number = 0.01): ProductAnimation => {
  const [rotation, setRotationState] = useState<THREE.Euler>(new THREE.Euler(0, 0, 0));
  const [highlightIntensity, setHighlightIntensityState] = useState<number>(1);
  const rotationSpeed = useRef<number>(initialRotationSpeed);
  const highlightColor = useRef<THREE.Color>(new THREE.Color('yellow'));

  const setRotation = useCallback((newRotation: THREE.Euler) => {
    if (!(newRotation instanceof THREE.Euler)) {
      console.error('Invalid rotation value. Must be a THREE.Euler instance.');
      return;
    }
    setRotationState(newRotation);
  }, []);

  const setHighlightIntensity = useCallback((intensity: number) => {
    if (typeof intensity !== 'number') {
      console.error('Invalid highlight intensity value. Must be a number.');
      return;
    }

    const clampedIntensity = Math.max(0, Math.min(1, intensity)); // Ensure value is between 0 and 1
    setHighlightIntensityState(clampedIntensity);
  }, []);

  const animate = useCallback((productModels: { path: string; gltf: THREE.GLTF }[]) => {
    useFrame(({ clock }) => {
      if (!productModels || productModels.length === 0) return;
      try {
        productModels.forEach((product, index) => {
          if (product.gltf && product.gltf.scene) {
            const angle = clock.getElapsedTime() * rotationSpeed.current + (index / productModels.length) * Math.PI * 2;
            product.gltf.scene.rotation.y = angle;
          }
        });
      } catch (error: any) {
        console.error('Error during animation:', error);
      }
    });
  }, []);

  useEffect(() => {
    rotationSpeed.current = initialRotationSpeed;
  }, [initialRotationSpeed]);

  return {
    rotation,
    setRotation,
    highlightIntensity,
    setHighlightIntensity,
    animate,
  };
};

export { useProductAnimation };
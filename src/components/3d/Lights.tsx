// src/components/3d/Lights.tsx
/**
 * Purpose: Configures and adds lighting to the 3D scene.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface LightsProps {
  ambientIntensity?: number;
  directionalIntensity?: number;
  directionalPosition?: [number, number, number];
  shadowMapSize?: number;
}

const Lights: React.FC<LightsProps> = ({
  ambientIntensity = 0.3,
  directionalIntensity = 0.8,
  directionalPosition = [1, 5, 3],
  shadowMapSize = 2048,
}) => {
  const { scene } = useThree();
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    try {
      if (!scene) {
        console.error('Scene is not available. Lights cannot be added.');
        return;
      }

      // Ambient Light
      const ambientLight = new THREE.AmbientLight('#E0FFFF', ambientIntensity);
      scene.add(ambientLight);
      ambientLightRef.current = ambientLight;

      // Directional Light
      const directionalLight = new THREE.DirectionalLight('#FFFDD0', directionalIntensity);
      directionalLight.position.set(...directionalPosition);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = shadowMapSize;
      directionalLight.shadow.mapSize.height = shadowMapSize;
      scene.add(directionalLight);
      directionalLightRef.current = directionalLight;

      // Dispose of lights on unmount
      return () => {
        if (ambientLightRef.current) {
          scene.remove(ambientLightRef.current);
          ambientLightRef.current.dispose();
        }
        if (directionalLightRef.current) {
          scene.remove(directionalLightRef.current);
          directionalLightRef.current.dispose();
        }
      };
    } catch (error: any) {
      console.error('Error setting up lights:', error);
    }
  }, [scene, ambientIntensity, directionalIntensity, directionalPosition, shadowMapSize]);

  return null; // This component doesn't render anything directly
};

export default Lights;
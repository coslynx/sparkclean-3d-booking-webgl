// src/components/3d/Controls.tsx
/**
 * Purpose: Manages camera controls for the 3D scene, enabling user interaction with OrbitControls.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { useRef, useEffect, memo } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

extend({ OrbitControls });

interface ControlsProps {
  enableDamping?: boolean;
  dampingFactor?: number;
  minDistance?: number;
  maxDistance?: number;
}

const Controls = memo<ControlsProps>(({
  enableDamping = true,
  dampingFactor = 0.1,
  minDistance = 2,
  maxDistance = 10,
}) => {
  const { camera, gl } = useThree();
  const controls = useRef<THREE.OrbitControls>(null);

  useEffect(() => {
    if (!camera) {
      console.error('Camera is not available. OrbitControls cannot be initialized.');
      return;
    }

    if (minDistance >= maxDistance) {
      console.error('Invalid props: minDistance must be less than maxDistance.');
      return;
    }

    if (minDistance < 0 || maxDistance < 0) {
      console.error('Invalid props: minDistance and maxDistance must be positive numbers.');
      return;
    }

    try {
      if (controls.current) {
        controls.current.dispose();
      }

      controls.current = new OrbitControls(camera, gl.domElement);
      controls.current.enableZoom = true;
      controls.current.enablePan = true;
      controls.current.enableRotate = true;
      controls.current.minDistance = minDistance;
      controls.current.maxDistance = maxDistance;
      controls.current.enableDamping = enableDamping;
      controls.current.dampingFactor = dampingFactor;

    } catch (error: any) {
      console.error('Failed to initialize OrbitControls:', error);
    }

    return () => {
      if (controls.current) {
        controls.current.dispose();
      }
    };
  }, [camera, gl, enableDamping, dampingFactor, minDistance, maxDistance]);

  useFrame(() => {
    if (enableDamping && controls.current) {
      controls.current.update();
    }
  });

  return null; // This component doesn't render anything directly
});

Controls.displayName = 'Controls';

export default Controls;
// src/hooks/useRoomAnimation.ts
/**
 * Purpose: Provides custom hooks for managing animations within the main room scene, specifically subtle effects like dust motes.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoomAnimation {
  dustParticles: THREE.Points | undefined;
  animateDust: () => void;
  dustMoteCount: number;
  driftSpeed: number;
}

const useRoomAnimation = (): RoomAnimation => {
  const [dustParticles, setDustParticles] = useState<THREE.Points | undefined>(undefined);
  const dustGeometryRef = useRef<THREE.BufferGeometry | undefined>(undefined);
  const dustMaterialRef = useRef<THREE.PointsMaterial | undefined>(undefined);
  const dustMoteCount = 1000;
  const driftSpeed = 0.01;

  useEffect(() => {
    try {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(dustMoteCount * 3);

      for (let i = 0; i < dustMoteCount; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const z = Math.random() * 2 - 1;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      dustGeometryRef.current = geometry;

      const material = new THREE.PointsMaterial({
        color: 0xcccccc,
        size: 0.01,
        transparent: true,
        opacity: 0.6,
      });
      dustMaterialRef.current = material;

      const points = new THREE.Points(geometry, material);
      setDustParticles(points);
    } catch (error: any) {
      console.error('Error creating dust particles:', error);
    }

    return () => {
      if (dustGeometryRef.current) {
        dustGeometryRef.current.dispose();
      }
      if (dustMaterialRef.current) {
        dustMaterialRef.current.dispose();
      }
    };
  }, [dustMoteCount]);

  const animateDust = useCallback(() => {
    useFrame(() => {
      if (dustGeometryRef.current) {
        const positions = dustGeometryRef.current.attributes.position.array as Float32Array;

        for (let i = 0; i < dustMoteCount; i++) {
          positions[i * 3] += (Math.random() - 0.5) * driftSpeed * 0.1;
          positions[i * 3 + 1] += (Math.random() - 0.5) * driftSpeed * 0.1;
          positions[i * 3 + 2] += (Math.random() - 0.5) * driftSpeed * 0.1;
        }

        dustGeometryRef.current.attributes.position.needsUpdate = true;
      }
    });
  }, [dustMoteCount, driftSpeed]);

  return { dustParticles, animateDust, dustMoteCount, driftSpeed };
};

export { useRoomAnimation };
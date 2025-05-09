// src/components/3d/Environment.tsx
/**
 * Purpose: Sets up the 3D environment for the scene, including background and lighting.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { Environment as DreiEnvironment } from '@react-three/drei';

interface EnvironmentProps {
  preset?: string;
  intensity?: number;
  background?: boolean;
}

const Environment: React.FC<EnvironmentProps> = ({ preset = 'sunset', intensity = 0.5, background = true }) => {
  const { scene, gl } = useThree();
  const textureLoader = useRef(new THREE.TextureLoader());
  const rgbeLoader = useRef(new RGBELoader());
  const currentIntensity = useRef(intensity);

  const environmentMap = useMemo(() => {
    try {
      if (preset === "city") {
        rgbeLoader.current.setDataType(THREE.FloatType);
        return new Promise((resolve, reject) => {
          rgbeLoader.current.load('public/textures/environment/city.hdr',
            (texture) => {
              const envMap = gl.xr.getFramebuffer() ? gl.textureToRenderTarget(texture).texture : texture;
              resolve(envMap);
            },
            undefined,
            (error) => {
              console.error('Failed to load HDR environment map:', error);
              reject(error);
            }
          );
        });
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error creating environment map:', error);
      return null;
    }
  }, [preset, gl]);

  useEffect(() => {
    if (environmentMap) {
      environmentMap.then((envMap) => {
        if (envMap) {
          scene.environment = envMap;
          if (background) {
            scene.background = envMap;
          }
        }
      }).catch(err => {
        console.error("Failed to apply HDR environment map", err);
      });
    } else {
      if (preset && preset !== "city") {
          // Skip background handling for Drei Environment presets
          console.log("Using Drei Environment");
      }
      else {
        scene.background = new THREE.Color("#FFFFFF");
      }
    }
    return () => {
      if (scene.environment) {
        scene.environment = null;
      }
      scene.background = null;
    };
  }, [scene, environmentMap, background, preset]);

  useFrame(() => {
    if (currentIntensity.current !== intensity && scene.environment) {
      currentIntensity.current = intensity;
    }
  });

  if (preset === "city") {
    return null;
  }
  return <DreiEnvironment preset={preset} intensity={intensity} />;
};

export default Environment;
// src/utils/modelLoader.ts
/**
 * Purpose: Provides a static `ModelLoader` class for efficient 3D model loading and caching,
 * optimized for use with Three.js and React Three Fiber. Handles GLTF/GLB models.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * ModelLoader Class
 * Provides static methods for loading and caching 3D models in GLTF/GLB format.
 */
export class ModelLoader {
  /**
   * @static modelCache - A static cache to store loaded GLTF models, using the model path as the key.
   */
  private static modelCache: Map<string, GLTF> = new Map();

  /**
   * @static loadModel - Loads a 3D model from the given path, using the cache if available.
   * Implements Draco compression support and handles cross-origin requests.
   *
   * @param {string} path - The URL of the GLTF/GLB model to load.  Must be a non-empty string
   * pointing to a valid, accessible resource.
   *
   * @returns {Promise<GLTF>} A Promise that resolves with the loaded GLTF model.
   *
   * @throws {Error} If the model path is invalid or the model loading fails. The error message
   * provides details about the failure, such as invalid path, network errors, or unsupported
   * file format.
   *
   * @example
   * // Usage with a valid model path:
   * ModelLoader.loadModel('/models/room.glb')
   *   .then(gltf => {
   *     // Use the loaded model
   *     scene.add(gltf.scene);
   *   })
   *   .catch(error => {
   *     console.error('Failed to load model:', error);
   *   });
   *
   * @example
   * // Usage with an invalid model path:
   * ModelLoader.loadModel('')
   *   .catch(error => {
   *     console.error('Failed to load model:', error); // Expected error: Invalid model path
   *   });
   */
  public static async loadModel(path: string): Promise<GLTF> {
    if (typeof path !== 'string' || path.trim() === '') {
      const errorMessage = 'Invalid model path: Path must be a non-empty string.';
      console.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    const sanitizedPath = path.trim();

    if (ModelLoader.modelCache.has(sanitizedPath)) {
      console.log(`Using cached model for path: ${sanitizedPath}`);
      return ModelLoader.modelCache.get(sanitizedPath)!;
    }

    const loadingStart = performance.now();

    return new Promise<GLTF>((resolve, reject) => {
      try {
        const loader = new GLTFLoader();

        // Draco compression support
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/'); // Ensure files are in the public directory
        loader.setDRACOLoader(dracoLoader);

        // Handle cross-origin requests
        loader.setCrossOrigin('anonymous');

        loader.load(
          sanitizedPath,
          (gltf: GLTF) => {
            ModelLoader.modelCache.set(sanitizedPath, gltf);
            const loadingTime = performance.now() - loadingStart;
            console.log(`Model loaded and cached from ${sanitizedPath} in ${loadingTime.toFixed(2)}ms`);
            resolve(gltf);
          },
          undefined,
          (error: any) => {
            const errorMessage = `Failed to load model from ${sanitizedPath}: ${error.message || 'Unknown error'}`;
            console.error(errorMessage, error);
            reject(new Error(errorMessage));
          }
        );
      } catch (error: any) {
        const errorMessage = `Error initializing GLTFLoader: ${error.message || 'Unknown error'}`;
        console.error(errorMessage, error);
        reject(new Error(errorMessage));
      }
    });
  }
}
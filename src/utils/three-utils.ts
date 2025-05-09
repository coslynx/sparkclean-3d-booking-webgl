// src/utils/three-utils.ts
/**
 * Purpose: Provides utility functions for working with Three.js, such as raycasting.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import * as THREE from 'three';

/**
 * ThreeUtils Object
 * Provides utility functions for Three.js operations.
 */
const threeUtils = {
    /**
     * getIntersectedObject Function
     * Performs raycasting to detect intersections between the user's pointer and objects in the 3D scene.
     * @param pointer - A THREE.Vector2 representing the pointer's normalized coordinates.
     * @param scene - The THREE.Scene to perform raycasting in.
     * @param camera - The THREE.Camera used for raycasting.
     * @returns The closest intersected THREE.Object3D, or null if no intersection is found or if inputs are invalid.
     */
    getIntersectedObject: (pointer: THREE.Vector2, scene: THREE.Scene | null, camera: THREE.Camera | null): THREE.Object3D | null => {
        if (!pointer || !(pointer instanceof THREE.Vector2)) {
            console.error('Invalid pointer provided. Must be a THREE.Vector2 instance.');
            return null;
        }

        if (!scene || !(scene instanceof THREE.Scene)) {
            console.error('Invalid scene provided. Must be a THREE.Scene instance.');
            return null;
        }

        if (!camera || !(camera instanceof THREE.Camera)) {
            console.error('Invalid camera provided. Must be a THREE.Camera instance.');
            return null;
        }

        try {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(pointer, camera);
            raycaster.far = 10;
            raycaster.params.Mesh = { threshold: 0.1 }; //Only checks for Meshes and a small threshold to be more accurate

            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                let closestIntersectedObject: THREE.Object3D | null = null;

                for (const intersect of intersects) {
                    if (intersect.object instanceof THREE.Mesh) {
                        if (!closestIntersectedObject) {
                            closestIntersectedObject = intersect.object;
                        } else {
                            if (intersect.distance < closestIntersectedObject.getWorldPosition(new THREE.Vector3()).distanceTo(camera.position)) {
                                closestIntersectedObject = intersect.object;
                            }
                        }
                    }
                }
                if (closestIntersectedObject && closestIntersectedObject.name) {
                  return closestIntersectedObject;
                }
                return null;
            }

            return null;
        } catch (error: any) {
            console.error('Error during raycasting:', error);
            return null;
        }
    },
};

export { threeUtils };
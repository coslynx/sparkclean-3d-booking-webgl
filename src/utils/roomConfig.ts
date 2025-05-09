// src/utils/roomConfig.ts
/**
 * Purpose: Defines configuration settings for the room scene, such as colors and interactive element IDs.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

interface RoomConfig {
  interactiveElementIds: string[];
}

const roomConfig: RoomConfig = {
  interactiveElementIds: ['table', 'sofa', 'window'],
};

export { roomConfig };
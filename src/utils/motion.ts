// src/utils/motion.ts
/**
 * Purpose: Provides reusable animation utilities based on framer-motion for consistent UI transitions and effects.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import { Transition, Variants } from 'framer-motion';

/**
 * FadeInAnimationConfig Interface
 * Defines the configuration for the fadeIn animation variant, including duration and delay.
 */
interface FadeInAnimationConfig {
  duration?: number;
  delay?: number;
}

/**
 * AnimationVariants Type
 * Defines the structure for common animation variants.
 */
type AnimationVariants = Variants;

/**
 * fadeIn Function
 * Creates a fadeIn animation variant with configurable duration and delay, utilizing ease-in-out transition.
 * @param config - Optional configuration for the fadeIn animation, including duration and delay.
 * @returns An AnimationVariants object representing the fadeIn animation.
 */
const fadeIn = (config: FadeInAnimationConfig = {}): AnimationVariants => {
  const { duration = 0.3, delay = 0 } = config;

  try {
    const transition: Transition = {
      duration: duration,
      ease: "easeInOut",
      delay: delay,
    };

    return {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
        transition,
      },
      exit: {
        opacity: 0,
        transition,
      },
    };
  } catch (error: any) {
    console.error("Error creating fadeIn animation:", error.message);
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
};

/**
 * scaleOnHover Function
 * Creates a scaleOnHover animation using framer-motion's whileHover prop to scale an element to 1.1 on hover.
 * @returns An object containing the scale animation configuration for the whileHover prop.
 */
const scaleOnHover = () => {
  try {
    return {
      whileHover: {
        scale: 1.1,
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      },
    };
  } catch (error: any) {
    console.error("Error creating scaleOnHover animation:", error.message);
    return {
      whileHover: { scale: 1 },
    };
  }
};

/**
 * slideFromBottom Function
 * Creates a slide-in from bottom animation variant with configurable duration and distance.
 * @param duration - Optional duration for the slide-in animation (default: 0.5s).
 * @param distance - Optional distance to slide from (default: 50px).
 * @returns An AnimationVariants object representing the slide-in animation.
 */
const slideFromBottom = (duration: number = 0.5, distance: number = 50): AnimationVariants => {
  try {
    return {
      initial: {
        opacity: 0,
        y: distance,
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: duration,
          ease: "easeOut",
        },
      },
      exit: {
        opacity: 0,
        y: distance,
        transition: {
          duration: duration,
          ease: "easeIn",
        },
      },
    };
  } catch (error: any) {
    console.error("Error creating slideFromBottom animation:", error.message);
    return {
      initial: { opacity: 0, y: distance },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: distance },
    };
  }
};

export { fadeIn, scaleOnHover, slideFromBottom };
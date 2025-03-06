declare module 'framer-motion' {
  import * as React from 'react';

  interface TransitionProperties {
    type?: string;
    stiffness?: number;
    damping?: number;
    duration?: number;
    ease?: string | number[];
    repeat?: number | Infinity;
    repeatType?: 'loop' | 'reverse' | 'mirror';
    delay?: number;
  }

  export interface AnimationProps {
    initial?: object | string | boolean;
    animate?: object | string;
    exit?: object | string;
    variants?: {
      [key: string]: {
        [key: string]: any;
      };
    };
    transition?: TransitionProperties;
    layout?: boolean;
    layoutId?: string;
  }

  export interface MotionProps extends AnimationProps {
    style?: React.CSSProperties;
    className?: string;
    key?: React.Key;
    children?: React.ReactNode;
    onAnimationComplete?: () => void;
    onAnimationStart?: () => void;
    whileHover?: object | string;
    whileTap?: object | string;
    whileFocus?: object | string;
    whileDrag?: object | string;
    drag?: boolean | 'x' | 'y';
    dragConstraints?: object;
    dragElastic?: number | boolean;
  }

  export interface AnimatePresenceProps {
    children: React.ReactNode;
    mode?: 'sync' | 'wait' | 'popLayout';
    initial?: boolean;
    onExitComplete?: () => void;
  }

  type HTMLMotionComponents = {
    [K in keyof HTMLElementTagNameMap]: React.ForwardRefExoticComponent<
      MotionProps &
        React.HTMLAttributes<HTMLElementTagNameMap[K]> & {
          disabled?: boolean;
        }
    >;
  };

  type SVGMotionComponents = {
    [K in keyof SVGElementTagNameMap]: React.ForwardRefExoticComponent<
      MotionProps & React.SVGAttributes<SVGElementTagNameMap[K]>
    >;
  };

  export const motion: HTMLMotionComponents & SVGMotionComponents;

  export const AnimatePresence: React.FC<AnimatePresenceProps>;
}
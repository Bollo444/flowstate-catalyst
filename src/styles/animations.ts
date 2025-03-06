type AnimationVariant = {
  [key: string]: any;
  transition?: {
    duration?: number;
    ease?: string;
    repeat?: number | boolean;
    type?: string;
    stiffness?: number;
    damping?: number;
  };
};

type Variants = {
  initial?: AnimationVariant;
  animate?: AnimationVariant;
  exit?: AnimationVariant;
};

export const flowAnimations = {
  enter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  flowPulse: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
  ripple: {
    scale: [1, 1.01, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
} as const;

export const scoreTransition: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0
  },
  animate: {
    scale: 1,
    opacity: 1
  },
  exit: {
    scale: 0.8,
    opacity: 0
  }
};

export const statusTransition: Variants = {
  initial: {
    y: 10,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1
  },
  exit: {
    y: -10,
    opacity: 0
  }
};

export const cardTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const teamMemberTransition: Variants = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2
    }
  }
};

export const flowStatusIndicator = {
  peak: {
    scale: [1, 1.1, 1],
    boxShadow: [
      '0 0 0px rgba(80, 181, 132, 0.5)',
      '0 0 20px rgba(80, 181, 132, 0.8)',
      '0 0 0px rgba(80, 181, 132, 0.5)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
  flow: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 0 0px rgba(59, 130, 246, 0.5)',
      '0 0 15px rgba(59, 130, 246, 0.7)',
      '0 0 0px rgba(59, 130, 246, 0.5)'
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
  rest: {
    scale: 1,
    boxShadow: '0 0 0px rgba(139, 92, 246, 0.3)',
    transition: {
      duration: 1
    }
  },
  building: {
    scale: [1, 1.02, 1],
    boxShadow: [
      '0 0 0px rgba(245, 158, 11, 0.5)',
      '0 0 10px rgba(245, 158, 11, 0.6)',
      '0 0 0px rgba(245, 158, 11, 0.5)'
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

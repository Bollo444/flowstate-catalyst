import { useState } from 'react';

interface FlowWhisper {
  id: string;
  message: string;
  type: 'motivation' | 'insight' | 'achievement' | 'flow-check';
  emoji?: string[];
  interaction?: 'emoji' | 'quick-reply' | 'acknowledge';
}

export const useFlowWhispers = () => {
  const [flowStreak, setFlowStreak] = useState(0);
  const flowWhispers: FlowWhisper[] = [
    {
      id: 'flow-1',
      message: "Every interaction maintains the flow ⚡",
      type: 'flow-check',
      emoji: ['⚡', '🌊', '✨'],
    },
    {
      id: 'insight-1',
      message: "You're in perfect flow! How's the momentum?",
      type: 'insight',
      emoji: ['🚀', '💫', '🎯'],
    },
    {
      id: 'achievement-1',
      message: "Born in Flow, Built in Flow!",
      type: 'achievement',
      emoji: ['🌟', '💪', '🎉'],
    },
    {
      id: 'motivation-1',
      message: "Riding the productivity wave! 🌊",
      type: 'motivation',
      emoji: ['🌊', '🚀', '💫'],
    },
    {
      id: 'motivation-2',
      message: "Flow and grow! ⚡",
      type: 'motivation',
      emoji: ['⚡', '🌱', '✨'],
    },
    {
      id: 'motivation-3',
      message: "You're in the zone! How's it feeling? ✨",
      type: 'motivation',
      emoji: ['✨', '🎯', '🚀'],
    },
    {
      id: 'motivation-4',
      message: "Maintaining momentum... keep it flowing! 🚀",
      type: 'motivation',
      emoji: ['🚀', '📈', '🎯'],
    },
    {
      id: 'motivation-5',
      message: "Another seamless transition! You're on fire! 🔥",
      type: 'motivation',
      emoji: ['🔥', '💫', '⚡️'],
    },
    {
      id: 'motivation-6',
      message: "Flow state: Activated! Ready for more? 💫",
      type: 'motivation',
      emoji: ['💫', '🔓', '🔑'],
    },
    {
      id: 'motivation-7',
      message: "Flow is the key, to setting your productivity free 🔓",
      type: 'motivation',
      emoji: ['🔓', '🚀', '🎯'],
    },
    {
      id: 'motivation-8',
      message: "Unlock your potential, in the flow is essential ✨",
      type: 'motivation',
      emoji: ['✨', '🔑', '🌱'],
    }
  ];

  const triggerWhisper = (currentActivity: string) => {
    // Dummy flow state analysis - replace with actual logic
    const flowMaintained = Math.random() > 0.5; 

    if (flowMaintained) {
      setFlowStreak(prev => prev + 1);
      const whisperIndex = flowStreak % flowWhispers.length;
      const whisper = flowWhispers[whisperIndex];
      
      // Trigger encouraging whisper
      return whisper;
    }
    
    return null;
  };

  return { triggerWhisper, flowStreak };
};